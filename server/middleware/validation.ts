import { body, validationResult } from 'express-validator';

export default {
    validateEmail: body('email').isEmail().normalizeEmail(),
    validatePassword: body('password').isLength({ min: 8 }).trim(),
    validatePasswordMatch: body('password').custom((value, { req }) => {
        if (value !== req.body.password_repeat) {
            return false;
        }
        return true;
    }),
    validationResult,
};
