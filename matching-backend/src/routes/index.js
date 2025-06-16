import express from 'express';
import authRoutes from './auth.routes.js';
import matchRoutes from './match.routes.js';
import messageRoutes from './message.routes.js';
import metadataRoutes from './metadata.routes.js';
import notificationRoutes from './notifications.routes.js';
import reportRoutes from './reports.routes.js';
import uploadRoutes from './upload.routes.js';
import userRoutes from './user.routes.js';
import aiRoutes from './ai.routes.js';

const router = express.Router();

console.log("userRoutes exists:", !!userRoutes);

router.use('/auth', authRoutes);
router.use('/match', matchRoutes);
router.use('/message', messageRoutes);
router.use('/metadata', metadataRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);
router.use('/upload', uploadRoutes);
router.use('/user', userRoutes);
router.use('/ai', aiRoutes); 

function logRoutes(router, prefix = '') {
    router.stack.forEach((layer) => {
        if (layer.route) {
            console.log(
                `Route: ${Object.keys(layer.route.methods).join(', ').toUpperCase()} ${prefix}${layer.route.path}`
            );
        } else if (layer.handle.stack) {
            logRoutes(layer.handle, `${prefix}${layer.regexp.toString().split('?')[0].replace(/\/\^/, '')}`);
        }
    });
}

console.log("Logging all registered routes:");
logRoutes(router, '/api');

export default router;