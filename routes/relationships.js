import express from 'express';
const routes = express.Router();
import { getRelationship, addRelationship, addRelationshipWithEmail, updateRelationshipStatus } from '../controllers/relationshipController.js';

routes.post('/', addRelationship);
routes.post('/request', addRelationshipWithEmail);
routes.get('/:userId', getRelationship);
routes.put('/:userId/:relationshipId', updateRelationshipStatus);

export default routes;

