import express from 'express';
const routes = express.Router();
import userRoutes from './users.js';
import relationshipRoutes from './relationships.js';
import activityRoutes from './activities.js';
import letterRoutes from './letters.js';
import checkinRoutes from './checkins.js';

routes.use('/users', userRoutes);
routes.use('/relationships', relationshipRoutes);
routes.use('/activities', activityRoutes);
routes.use('/letters', letterRoutes);
routes.use('/checkins', checkinRoutes);


export default routes;