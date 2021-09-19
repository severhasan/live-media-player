import UserModel from '../models/User';
import { Document } from 'mongoose';

export default class UserService {
    static async createUser(email: string, password: string): Promise<Document> {
        // throw new Error('Not implemented');
        const user = new UserModel({
            email,
            password,
        });
        const savedUser = await user.save();
        return savedUser;
    }
}
