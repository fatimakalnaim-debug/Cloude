const http = require('http');
const fs = require('fs');
const url = require('url');

let tasks = [];

// محاولة تحميل البيانات من ملف إذا كانت موجودة
try {
  const data = fs.readFileSync('tasks.json', 'utf-8');
  tasks = JSON.parse(data);
} catch (e) {
  tasks = [];
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // API للموقع
  if (pathname === '/api/tasks') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(tasks));
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const task = JSON.parse(body);
        task.id = Date.now().toString();
        task.createdAt = new Date().toISOString();
        tasks.push(task);
        saveTasks();
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(task));
      });
    } else if (req.method === 'DELETE') {
      const id = parsedUrl.query.id;
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } else if (req.method === 'PUT') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        tasks = JSON.parse(body);
        saveTasks();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tasks));
      });
    }
  } else if (pathname === '/') {
    // خدمة الملف HTML
    fs.readFile('wedding-prep.html', 'utf-8', (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

function saveTasks() {
  fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
