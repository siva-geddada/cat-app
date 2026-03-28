const http = require('http');
const https = require('https');

const TARGET_HOST = 'gps6cdg7h9.execute-api.eu-central-1.amazonaws.com';
const TARGET_BASE = '/prod';
const PORT = 4201;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Accept,Authorization',
  'Access-Control-Max-Age': '86400',
};

http.createServer((req, res) => {
  // Strip /api prefix
  const targetPath = TARGET_BASE + req.url.replace(/^\/api/, '');

  // Handle OPTIONS preflight locally — never forward to API Gateway
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    console.log(`[OPTIONS] ${req.url} → 204 (handled locally)`);
    return;
  }

  // Collect request body
  const chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', () => {
    const body = Buffer.concat(chunks);

    const options = {
      hostname: TARGET_HOST,
      port: 443,
      path: targetPath,
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': body.length,
      },
    };

    console.log(`[${req.method}] ${req.url} → https://${TARGET_HOST}${targetPath}`);

    const proxyReq = https.request(options, proxyRes => {
      const responseHeaders = {
        ...CORS_HEADERS,
        'Content-Type': proxyRes.headers['content-type'] || 'application/json',
      };
      res.writeHead(proxyRes.statusCode, responseHeaders);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', err => {
      console.error('Proxy error:', err.message);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: err.message }));
    });

    if (body.length > 0) proxyReq.write(body);
    proxyReq.end();
  });

}).listen(PORT, () => {
  console.log(`✅ Proxy running on http://localhost:${PORT}`);
  console.log(`   /api/* → https://${TARGET_HOST}${TARGET_BASE}/*`);
});
