const https = require('https');

const TARGET_HOST = 'gps6cdg7h9.execute-api.eu-central-1.amazonaws.com';
const TARGET_BASE = '/prod';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Accept,Authorization',
  'Access-Control-Max-Age': '86400',
};

module.exports = async (req, res) => {
  // Handle OPTIONS preflight locally
  if (req.method === 'OPTIONS') {
    Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
    res.status(204).end();
    return;
  }

  // Strip /api prefix to get the actual path e.g. /create, /list, /update?id=...
  const targetPath = TARGET_BASE + req.url.replace(/^\/api/, '');

  // Collect body
  const body = await new Promise((resolve) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
  });

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

  return new Promise((resolve) => {
    const proxyReq = https.request(options, (proxyRes) => {
      Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
      res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'application/json');
      res.status(proxyRes.statusCode);

      const chunks = [];
      proxyRes.on('data', chunk => chunks.push(chunk));
      proxyRes.on('end', () => {
        res.end(Buffer.concat(chunks));
        resolve();
      });
    });

    proxyReq.on('error', (err) => {
      res.status(502).json({ message: err.message });
      resolve();
    });

    if (body.length > 0) proxyReq.write(body);
    proxyReq.end();
  });
};
