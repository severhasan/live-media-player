import { Router } from 'express';
import config from '../config';
import jsonwebtoken from 'jsonwebtoken';
import validation from '../middleware/validation';
import UserService from '../services/UserService';

const router = Router();

router.post('/signin', validation.validateEmail, validation.validatePassword, async (req, res) => {
    const validationErrors = validation.validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.sendStatus(400);
    }

    // if credentials are correct, create & send the token
    // ...
    const { email, password } = req.body;
    const user = await UserService.findByEmail(email);
    if (!user) res.send({ error: true });

    const isValid = user.comparePassword(password);
    if (!isValid) return res.sendStatus(400);

    const token = jsonwebtoken.sign({ id: user._id }, config.JWT_SECRET);
    res.cookie('token', token, { secure: true, sameSite: true, httpOnly: true });
    res.sendStatus(200);

    // also send token to the client as payload if necessary
    // res.json({})
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
