import Relationship from '../models/relationship.js';

export const getRelationships = async (req, res) => {
    try {
        const userId = req.params.userId;
        const relationships = await Relationship.find({ userId }).lean();
        res.status(200).json(relationships);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving relationships', error });
    }
};

export const addRelationship = async (req, res) => {
    try {
        const newRelationship = new Relationship(req.body);
        const savedRelationship = await newRelationship.save();
        res.status(201).json(savedRelationship);
    } catch (error) {
        res.status(500).json({ message: 'Error adding relationship', error });
    }
};

export const removeRelationship = async (req, res) => {
    try {
        const { userId, relationshipId } = req.params;
        const deletedRelationship = await Relationship.findOneAndDelete({
            _id: relationshipId,
            $or: [{ user1: userId }, { user2: userId }]
        });
        if (!deletedRelationship) {
            return res.status(404).json({ message: 'Relationship not found' });
        }
        res.status(200).json({ message: 'Relationship removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing relationship', error });
    }
};