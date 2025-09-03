/**
 * Static File Server for Lisa Cohen Physical Therapy & Health Center
 * Simple HTTP server to serve static files with proper MIME types and caching headers
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// MIME type mappings for different file extensions
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

/**
 * Handle HTTP requests and serve static files
 */
const server = http.createServer((req, res) => {
  // Log request for debugging
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Determine file path
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  // Get file extension and corresponding MIME type
  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeType = mimeTypes[extname] || 'application/octet-stream';

  // Read and serve the file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      handleError(res, error, filePath);
    } else {
      serveFile(res, content, mimeType);
    }
  });
});

/**
 * Handle file read errors
 */
function handleError(res, error, filePath) {
  if (error.code === 'ENOENT') {
    console.error(`File not found: ${filePath}`);
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head><title>404 Not Found</title></head>
        <body>
          <h1>404 - File Not Found</h1>
          <p>The requested file could not be found.</p>
        </body>
      </html>
    `);
  } else {
    console.error(`Server error for ${filePath}:`, error);
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head><title>500 Server Error</title></head>
        <body>
          <h1>500 - Server Error</h1>
          <p>An internal server error occurred.</p>
        </body>
      </html>
    `);
  }
}

/**
 * Serve file with appropriate headers
 */
function serveFile(res, content, mimeType) {
  res.writeHead(200, { 
    'Content-Type': mimeType,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  res.end(content, 'utf-8');
}

/**
 * Start the server
 */
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || 'localhost';

server.listen(PORT, HOST, () => {
  console.log('🚀 Lisa Cohen PT & Health Center server started');
  console.log(`📍 Server running at http://${HOST}:${PORT}/`);
  console.log(`📁 Serving files from: ${path.resolve('.')}`);
  console.log('Press Ctrl+C to stop the server');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Server shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
