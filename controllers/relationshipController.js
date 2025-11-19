import Relationship from '../models/relationship.js';
import User from '../models/user.js';

export const getRelationship = async (req, res) => {
    try {
        const userId = req.params.userId;
        const relationship = await Relationship.findOne({ $or: [
            { user1: userId },
            { user2: userId }
        ]});
            if (!relationship) {
            return res.status(404).json({ message: 'Relationship not found' });
        }
        res.status(200).json(relationship);
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

export const addRelationshipWithEmail = async (req, res) => {
    
    try {
        const { user1, user2Email } = req.body;
        const user2 = await User.findOne({ email: user2Email }).lean();
        console.log('Found user2:', user2);

        if (!user2) {
            return res.status(404).json({ message: 'User with provided email not found' });
        } else if (user2._id === user1) {
            return res.status(400).json({ message: 'Cannot create relationship with yourself' });
        }
        const newRelationship = new Relationship({ user1, user2: user2._id, status: 'pending' });
        const savedRelationship = await newRelationship.save();
        res.status(201).json(savedRelationship);
    } catch (error) {
        res.status(500).json({ message: 'Error adding relationship', error });
    }
};

export const updateRelationship = async (req, res) => {
    try {
        const { userId, relationshipId } = req.params;
        const updateData = req.body;
        if(updateData.status =="blocked"){
            await Relationship.findOneAndDelete({ _id: relationshipId });
            res.status(200).json({ message: 'Relationship blocked and deleted successfully' });
        } else {
            const updatedRelationship = await Relationship.findOneAndUpdate(
                { _id: relationshipId },
                updateData,
                { new: true }
            );
            if (!updatedRelationship) {
                return res.status(404).json({ message: 'Relationship not found' });
            }
            res.status(200).json(updatedRelationship);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating relationship status', error });
    }
}