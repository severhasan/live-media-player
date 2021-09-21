import { Router } from 'express';
import config from '../config';
import jsonwebtoken from 'jsonwebtoken';
import validation from '../middleware/validation';
import UserService from '../services/UserService';

const router = Router();

// auth routes
router.get('/signin', (_req, res) => {
    // if credentials are correct, create & send the token
    // ...

    const token = jsonwebtoken.sign({ id: '', user: 'johndoe' }, config.JWT_SECRET);
    res.cookie('token', token, { sameSite: true, httpOnly: true });
    // res.json({});
});
router.post(
    '/signup',
    validation.validateEmail,
    validation.validatePassword,
    validation.validatePasswordMatch,
    async (req, res) => {
        const validationErrors = validation.validationResult(req);
        if (!validationErrors.isEmpty()) {
            console.log('validationErrors', validationErrors);
            return res.sendStatus(400);
        }
        // create new user
        const { email, password } = req.body;
        await UserService.createUser(email, password);

        res.sendStatus(200);
    }
);

export default router;
