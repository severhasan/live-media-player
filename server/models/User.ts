import bcrypt from 'bcrypt';
import crypto from 'crypto';
import config from '../config';
import mongoose, { Schema, Document, Model } from 'mongoose';

interface IUser {
    email: string;
    password: string;
    verified: boolean;
    verificationToken: string;
}

export interface IUserDocument extends IUser, Document {
    comparePassword: (password: string) => Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {
    findByEmail: (email: string) => Promise<IUserDocument>;
}

const UserSchema: Schema<IUserDocument> = new Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            index: { unique: true },
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            trim: true,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            required: true,
            index: true,
            unique: true,
            default: () => crypto.randomBytes(20).toString('hex'),
        },
    },
    {
        timestamps: true,
    }
);

async function generateHash(password: string) {
    const salt = await bcrypt.genSalt(config.SALT);
    return bcrypt.hash(password, salt);
}
UserSchema.pre('save', function preSave(next) {
    // this = user document
    if (this.isModified('password')) {
        return generateHash(this.password)
            .then((hash) => {
                this.password = hash;
                return next();
            })
            .catch((error) => {
                return next(error);
            });
    }
    return next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.statics.findByEmail = function (email: string) {
    return this.findOne({ email });
};

const User = mongoose.model<IUserDocument, IUserModel>('User', UserSchema);
export default User;
