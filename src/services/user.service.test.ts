import {UserService} from '../services/user.service';
import fs from 'fs';

describe('UserService', () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService();
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('should initialize users array with empty array if no users in file', async () => {
            jest.spyOn(fs.promises, 'readFile').mockResolvedValueOnce(JSON.stringify({users: []}) as any);
            await userService.getUsers();
            expect(userService.users).toEqual([]);
        });
    });

    describe('getUser', () => {
        it('should return 404 status code for non-existent user', async () => {
            const userId = 'nonexistent_id';
            const result = userService.getUser(userId);
            expect(result.statusCode).toEqual(404);
            expect(result.message).toEqual("Record with id does not exist");
        });
    });
    describe('deleteUser', () => {
        it('should delete a user from the service by ID', () => {
            const mockUsers = [
                {id: '1', username: 'user1', age: 25, hobbies: ['reading', 'gaming']},
                {id: '2', username: 'user2', age: 30, hobbies: ['coding', 'music']},
            ];
            userService.users = [...mockUsers];

            const userIdToDelete = '1';
            const result = userService.deleteUser(userIdToDelete);

            expect(result.statusCode).toEqual(204);
            expect(result.message).toEqual("User deleted successfully");
            expect(userService.users.length).toEqual(mockUsers.length - 1);
            expect(userService.users.find(user => user.id === userIdToDelete)).toBeUndefined();
        });
    });
});
