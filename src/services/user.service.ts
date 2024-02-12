import {User} from "../models/models";
import fs from "fs";
import * as path from "path";

export class UserService {
    users: User[] = [];
    usersDirPath: string = path.join(__dirname, '..', 'DB', 'users.json');

    constructor() {
        this.getUsers().then((users) => {
            this.users = users || [];
        });
    }

    async getUsers(): Promise<User[]> {
        let fileContent: User[] = [];
        try {
            const data = await fs.promises.readFile(this.usersDirPath);
            fileContent = JSON.parse(data.toString()).users;
        } catch (err) {
            console.error("Error reading users file:", err);
        }
        return fileContent;
    }


    private writeFile(content: string) {
        fs.writeFile(this.usersDirPath, content, (err) => {
            if (err) throw err;
        });
    }

    private generateUserId(): string {
        return Math.floor(Math.random() * 100000000).toString();
    }

    getUser(id: string): { statusCode: number; message: string; user?: User } {
        const user = this.users.find(user => user.id === id);
        if (!user) {
            return {statusCode: 404, message: "Record with id does not exist"};
        }
        return {statusCode: 200, message: "Success", user};
    }

    createUser(userCredentials: { hobbies: Array<string>; id: string; age: number; username: string }): {
        statusCode: number;
        message: string;
        user?: User
    } {
        if (!userCredentials.username || !userCredentials.age) {
            return {statusCode: 400, message: "Request body does not contain required fields"};
        }
        const user: User = {
            ...userCredentials,
            id: this.generateUserId(),
        };
        this.users.push(user);
        this.writeFile(JSON.stringify({users: this.users}));
        return {statusCode: 201, message: "User created successfully", user};
    }

    updateUser(id: string, userCredentials: Omit<User, 'id' | 'creationTimestamp' | 'modificationTimestamp' | 'status'>): { statusCode: number; message: string; user?: User } {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            return {statusCode: 404, message: "Record with id does not exist"};
        }
        const user = this.users[userIndex];
        user.username = userCredentials.username;
        user.age = userCredentials.age;
        user.hobbies = userCredentials.hobbies;

        this.users[userIndex] = {...user};
        this.writeFile(JSON.stringify({users: this.users}));
        return {statusCode: 200, message: "User updated successfully", user};
    }

    deleteUser(id: string): { statusCode: number; message: string } {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            return {statusCode: 404, message: "Record with id does not exist"};
        }
        this.users.splice(userIndex, 1);
        this.writeFile(JSON.stringify({users: this.users}));
        return {statusCode: 204, message: "User deleted successfully"};
    }
}
