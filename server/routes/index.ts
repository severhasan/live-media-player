import { Router } from 'express';
import config from '../config';
import jsonwebtoken from 'jsonwebtoken';
import validation from '../middleware/validation';
import UserService from '../services/UserService';

const router = Router();

// auth routes
router.get('/signin', (req, res) => {
    // if credentials are correct, create & send the token
    // ...

    res.json({
        token: jsonwebtoken.sign({ user: 'johndoe' }, config.JWT_SECRET),
    });
});
router.get(
    '/signup',
    validation.validateEmail,
    validation.validatePassword,
    validation.validatePasswordMatch,
    async (req, res) => {
        const validationErrors = validation.validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.sendStatus(400);
        }
        // create new user
        const { email, password } = req.body;
        UserService.createUser(email, password);
    }
);

export default router;
