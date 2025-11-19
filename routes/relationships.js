import express from 'express';
const routes = express.Router();
import { getRelationship, addRelationship, addRelationshipWithEmail, updateRelationship } from '../controllers/relationshipController.js';

routes.post('/', addRelationship);
routes.post('/request', addRelationshipWithEmail);
routes.get('/:userId', getRelationship);
routes.put('/:userId/:relationshipId', updateRelationship);

export default routes;

