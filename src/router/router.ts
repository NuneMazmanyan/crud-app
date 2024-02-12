import {IncomingMessage, ServerResponse} from "http";
import {UserController} from "../controllers/user.controller";
import {UserService} from "../services/user.service";

const UserController1 = new UserController(new UserService());

function handleRequest(req: IncomingMessage, res: ServerResponse) {
    const url = req.url;
    const method = req.method;

    if (method === 'GET' && url === '/users') {
        UserController1.handleGetUsers(req, res);
    } else if (method === 'GET' && url?.startsWith('/users/')) {
        UserController1.handleGetUser(req, res);
    } else if (method === 'POST' && url === '/users') {
        UserController1.handleCreateUser(req, res);
    } else if (method === 'PATCH' && url?.startsWith('/users/')) {
        UserController1.handleUpdateUser(req, res);
    } else if (method === 'DELETE' && url?.startsWith('/users/')) {
        UserController1.handleDeleteUser(req, res);
    } else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Not Found'}));
    }
}

export default handleRequest;