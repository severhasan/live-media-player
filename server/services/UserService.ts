import UserModel, { IUserDocument } from '../models/User';
import { Document } from 'mongoose';

export default class UserService {
    static async createUser(email: string, password: string): Promise<Document> {
        const user = new UserModel({
            email,
            password,
        });
        const savedUser = await user.save();
        return savedUser;
    }

    static async findByEmail(email: string): Promise<IUserDocument> {
        return UserModel.findByEmail(email);
    }

    static async findById(id: string): Promise<IUserDocument> {
        return UserModel.findById(id);
    }
}
