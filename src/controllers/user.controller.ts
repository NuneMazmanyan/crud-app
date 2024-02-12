import { UserService } from "../services/user.service";
import { User } from "../models/models";
import { IncomingMessage, ServerResponse } from 'http';
import {v4 as uuidv4, validate} from 'uuid';

export class UserController {
    constructor(public UserService: UserService) {}

    handleGetUser(req: IncomingMessage, res: ServerResponse): void {
        const urlParts = req.url ? req.url.split('/') : [];
        const userId = urlParts[urlParts.length - 1];

        if (!userId || !validate(userId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid user ID' }));
            return;
        }

        try {
            const result = this.UserService.getUser(userId);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal Server Error' }));
        }
    }

    handleGetUsers(req: IncomingMessage, res: ServerResponse): void {
        try {
            const result = this.UserService.getUsers();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal Server Error' }));
        }
    }

    handleCreateUser(req: IncomingMessage, res: ServerResponse): void {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const userCredentials: User = JSON.parse(body);

            if (!userCredentials.username || !userCredentials.age) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Request body does not contain required fields" }));
                return;
            }

            const userId = uuidv4();

            try {
                const user = this.UserService.createUser({ ...userCredentials, id: userId });
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User created successfully', user }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
            }
        });
    }

    handleUpdateUser(req: IncomingMessage, res: ServerResponse): void {
        const urlParts = req.url ? req.url.split('/') : [];
        const userId = urlParts[urlParts.length - 1];

        if (!userId || !validate(userId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid user ID' }));
            return;
        }

        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const userCredentials = JSON.parse(body);

            try {
                const user = this.UserService.updateUser(userId, userCredentials);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User updated successfully', user }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
            }
        });
    }
    handleDeleteUser(req: IncomingMessage, res: ServerResponse): void {
        const urlParts = req.url ? req.url.split('/') : [];
        const userId = urlParts[urlParts.length - 1];

        if (!userId || !validate(userId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid user ID' }));
            return;
        }

        try {
            this.UserService.deleteUser(userId);
            res.writeHead(204, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User deleted successfully' }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal Server Error' }));
        }
    }
}
