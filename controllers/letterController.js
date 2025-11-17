import Letter from '../models/letter.js';

export const getLetters = async (req, res) => {
    try {
        const relationshipId = req.params.id;
        const letters = await Letter.find({ relationshipId }).lean();
        res.status(200).json(letters);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving letters', error });
    }
};

export const createLetter = async (req, res) => {
    try {
        const newLetter = new Letter(req.body);
        const savedLetter = await newLetter.save();
        res.status(201).json(savedLetter);
    } catch (error) {
        res.status(500).json({ message: 'Error creating letter', error });
    }
};

export const getLetterById = async (req, res) => {
    try {
        const { id, letterId } = req.params;
        const letter = await Letter.findOne({ relationshipId: id, _id: letterId }).lean();
        if (!letter) {
            return res.status(404).json({ message: 'Letter not found' });
        }
        res.status(200).json(letter);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving letter', error });
    }
};

export const updateLetter = async (req, res) => {
    try {
        const { id, letterId } = req.params;
        const updatedLetter = await Letter.findOneAndUpdate(
            { relationshipId: id, _id: letterId },
            req.body,
            { new: true }
        );
        if (!updatedLetter) {
            return res.status(404).json({ message: 'Letter not found' });
        }
        res.status(200).json(updatedLetter);
    } catch (error) {
        res.status(500).json({ message: 'Error updating letter', error });
    }
};

export const deleteLetter = async (req, res) => {
    try {
        const { id, letterId } = req.params;
        const deletedLetter = await Letter.findOneAndDelete({ relationshipId: id, _id: letterId });
        if (!deletedLetter) {
            return res.status(404).json({ message: 'Letter not found' });
        }
        res.status(200).json({ message: 'Letter deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting letter', error });
    }
};