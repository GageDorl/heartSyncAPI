import User from '../models/user.js';
import { v4 as uuidv4 } from 'uuid';

export const getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).lean();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const authID = req.oidc.user.sub;
        const user = await User.findOne({ authProviderId: authID }).lean();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving current user', error });
    }
};

export const updateCurrentUser = async (req, res) => {
    try {
        const authID = req.oidc.user.sub;
        const updatedUser = await User.findOneAndUpdate({ authProviderId: authID }, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating current user', error });
    }
};

export const createUser = async (req, res) => {
    try {
        const { name, timezone } = req.body;
        const authID = req.oidc.user.sub;
        const UUID = uuidv4();
        const providedEmail = req.oidc.user.email;
        const newUser = await User.create({
            _id: UUID,
            authProviderId: authID,
            name: name,
            email: providedEmail,
            timezone: timezone
        });
        console.log('Created new user:', newUser);
        res.status(201).json(newUser);
        res.redirect('/profile');
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};