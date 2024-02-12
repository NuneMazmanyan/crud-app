import http from 'http';
import handleRequest from './router';

const server: http.Server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    if (req.method === 'GET' && req.url?.startsWith('/users')) {
        handleRequest(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});