import express from 'express';
import pkg from 'express-openid-connect';
const routes = express.Router();
import userRoutes from './users.js';
import relationshipRoutes from './relationships.js';
import activityRoutes from './activities.js';
import letterRoutes from './letters.js';
import checkinRoutes from './checkins.js';
import authRoutes from './auth.js';


routes.use('/api/users', userRoutes);
routes.use('/api/relationships', relationshipRoutes);
routes.use('/api/activities', activityRoutes);
routes.use('/api/letters', letterRoutes);
routes.use('/api/checkins', checkinRoutes);
routes.use('/', authRoutes);
routes.use('/:path', (req, res) => {
    res.sendFile('404.html', { root: 'public' });
});

export default routes;