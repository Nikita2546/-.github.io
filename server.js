// ============================================================
//  КПУП "Речицаводоканал" — Node.js сервер
//  Запуск: node server.js
//  Сайт:   http://localhost:3000
// ============================================================

const http = require('http');
const fs   = require('fs');
const path = require('path');
const url  = require('url');

const PORT = 3000;

// ─── MIME типы ────────────────────────────────────────────
const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css':  'text/css; charset=utf-8',
    '.js':   'application/javascript; charset=utf-8',
    '.ico':  'image/x-icon',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.svg':  'image/svg+xml',
};

// ─── Простой роутер статики ────────────────────────────────
function serveStatic(res, filePath) {
    const ext  = path.extname(filePath);
    const mime = MIME[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }
        res.writeHead(200, { 'Content-Type': mime });
        res.end(data);
    });
}

// ─── Хелпер: отправить JSON ────────────────────────────────
function sendJSON(res, status, data) {
    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify(data));
}

// ─── Хелпер: прочитать тело запроса ───────────────────────
function readBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => (body += chunk));
        req.on('end', () => {
            try { resolve(JSON.parse(body)); }
            catch { resolve({}); }
        });
        req.on('error', reject);
    });
}

// ============================================================
//  HTTP SERVER
// ============================================================
const server = http.createServer(async (req, res) => {
    const parsed   = url.parse(req.url, true);
    const pathname = parsed.pathname;
    const method   = req.method.toUpperCase();

    // --- CORS preflight ---
    if (method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin':  '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        });
        res.end();
        return;
    }

    // ── API: статус сервера ─────────────────────────────────
    if (pathname === '/api/status' && method === 'GET') {
        sendJSON(res, 200, {
            ok:      true,
            server:  'Речицаводоканал API',
            version: '1.0.0',
            time:    new Date().toISOString(),
        });
        return;
    }

    // ── API: получить данные из «базы» ─────────────────────
    // GET /api/data?key=applications
    if (pathname === '/api/data' && method === 'GET') {
        const key = parsed.query.key;
        if (!key) { sendJSON(res, 400, { error: 'key required' }); return; }

        const dbFile = path.join(__dirname, 'db.json');
        let db = {};
        if (fs.existsSync(dbFile)) {
            try { db = JSON.parse(fs.readFileSync(dbFile, 'utf-8')); } catch {}
        }

        sendJSON(res, 200, { key, value: db[key] ?? null });
        return;
    }

    // ── API: сохранить данные ───────────────────────────────
    // POST /api/data  { key, value }
    if (pathname === '/api/data' && method === 'POST') {
        const body   = await readBody(req);
        const { key, value } = body;
        if (!key) { sendJSON(res, 400, { error: 'key required' }); return; }

        const dbFile = path.join(__dirname, 'db.json');
        let db = {};
        if (fs.existsSync(dbFile)) {
            try { db = JSON.parse(fs.readFileSync(dbFile, 'utf-8')); } catch {}
        }
        db[key] = value;
        fs.writeFileSync(dbFile, JSON.stringify(db, null, 2), 'utf-8');

        sendJSON(res, 200, { ok: true, key });
        return;
    }

    // ── Статические файлы ───────────────────────────────────
    let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);

    // Защита от path traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    serveStatic(res, filePath);
});

server.listen(PORT, () => {
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║   КПУП «Речицаводоканал» — сервер запущен       ║');
    console.log('╠══════════════════════════════════════════════════╣');
    console.log(`║   Сайт:  http://localhost:${PORT}                    ║`);
    console.log(`║   API:   http://localhost:${PORT}/api/status          ║`);
    console.log('╚══════════════════════════════════════════════════╝');
    console.log('\nНажми Ctrl+C чтобы остановить сервер.\n');
});
