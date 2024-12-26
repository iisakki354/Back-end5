import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeUserUpdate } from '../middleware/authorizationMiddleware.js';
import { Users } from '../models/User.js'; // Adjust the import based on your User model location

const router = express.Router();

// PUT /api/users/ - Update user info
router.put('/', authenticate, authorizeUserUpdate, async (req, res) => {
    const userId = req.user.userId; // Assuming userId is stored in req.user from the JWT
    const { username, email } = req.body;

    try {
        const updatedUser = await Users.findByIdAndUpdate(userId, { username, email }, { new: true });
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;