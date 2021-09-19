import bcrypt from 'bcrypt';
import crypto from 'crypto';
import mongoose from 'mongoose';

// helpers
async function comparePassword(candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
}
async function generateHash(password: string) {
    return bcrypt.hash(password, 12);
}

const userSchema = new mongoose.Schema(
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

userSchema.methods.comparePassword = comparePassword;
userSchema.pre('save', function preSave(next) {
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

export default mongoose.model('User', userSchema);
