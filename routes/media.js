import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeMediaOwner } from '../middleware/authorizationMiddleware.js';
import { Media } from '../models/Media.js';

const router = express.Router();

router.put('/:id', authenticate, authorizeMediaOwner, async (req, res) => {
    const mediaId = req.params.id;
    const { title, description } = req.body;

    try {
        const updatedMedia = await Media.findByIdAndUpdate(mediaId, { title, description }, { new: true });
        res.json(updatedMedia);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', authenticate, authorizeMediaOwner, async (req, res) => {
    const mediaId = req.params.id;

    try {
        await Media.findByIdAndDelete(mediaId);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;