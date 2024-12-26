import jwt from 'jsonwebtoken';
import { Media } from '../models';

const JWT_SECRET = 'your_jwt_secret';
export const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export const authorizeMediaOwner = async (req, res, next) => {
    const mediaId = req.params.id;
    const userId = req.user.userId;

    try {
        const mediaItem = await Media.findById(mediaId);
        if (!mediaItem) {
            return res.status(404).json({ message: 'Media item not found' });
        }

        if (mediaItem.user_id !== userId) {
            return res.status(403).json({ message: 'Unauthorized: You do not own this media item' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const authorizeUserUpdate = (req, res, next) => {
    const userId = req.user.userId;
    const targetUserId = req.body.user_id;

    if (userId !== targetUserId) {
        return res.status(403).json({ message: 'Unauthorized: You can only update your own information' });
    }

    next();
};