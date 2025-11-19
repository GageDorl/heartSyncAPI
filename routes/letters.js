import express from 'express';
const routes = express.Router();
import { getLetters, createLetter, getLetterById, updateLetter, deleteLetter } from '../controllers/letterController.js';

routes.get('/relationship/:id', getLetters);
routes.post('/relationship/:id', createLetter);
routes.get('/relationship/:id/:letterId', getLetterById);
routes.put('/relationship/:id/:letterId', updateLetter);
routes.delete('/relationship/:id/:letterId', deleteLetter);

export default routes;