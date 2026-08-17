const http = require('http');

const PORT = process.env.PORT || 3000;
const POD_NAME = process.env.POD_NAME || 'local';

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'healthy'
    }));
    return;
  }

  if (req.url === '/info') {
    res.writeHead(200);
    res.end(JSON.stringify({
      application: 'Kubernetes GitOps Demo',
      pod: POD_NAME,
      message: 'Running inside Kubernetes'
    }));
    return;
  }

  if (req.url === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({
      message: '🚀 Kubernetes GitOps Project',
      status: 'running',
      pod: POD_NAME
    }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({
    error: 'Route not found'
  }));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Pod: ${POD_NAME}`);
});