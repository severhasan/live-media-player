import express from 'express';
import fs from 'fs';
import path from 'path'

const router = express.Router();


router.get('/hello', (req, res) => {
    res.status(200).send('Hello Easter Egg');
});

router.get('/media-list', (req, res) => {
    const files = fs.readdirSync(path.join(__dirname, '../public/media'));
    res.json({ files });
});


export default router;
