import Checkin from '../models/checkin.js';

export const getCheckins = async (req, res) => {
    try {
        const userID = req.params.id;
        const checkins = await Checkin.find({ userId: userID });
        res.status(200).json(checkins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createCheckin = async (req, res) => {
    try {
        const newCheckin = new Checkin(req.body);
        const savedCheckin = await newCheckin.save();
        res.status(201).json(savedCheckin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const getCheckinById = async (req, res) => {
    try {
        const { id, checkinId } = req.params;
        const checkin = await Checkin.findOne({ userId: id, _id: checkinId });
        if (!checkin) {
            return res.status(404).json({ message: "Checkin not found" });
        }
        res.status(200).json(checkin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCheckin = async (req, res) => {
    try {
        const { id, checkinId } = req.params;
        const updatedCheckin = await Checkin.findOneAndUpdate({ userId: id, _id: checkinId }, req.body, { new: true });
        if (!updatedCheckin) {
            return res.status(404).json({ message: "Checkin not found" });
        }
        res.status(200).json(updatedCheckin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCheckin = async (req, res) => {
    try {
        const { id, checkinId } = req.params;
        const deletedCheckin = await Checkin.findOneAndDelete({ userId: id, _id: checkinId });
        if (!deletedCheckin) {
            return res.status(404).json({ message: "Checkin not found" });
        }
        res.status(200).json({ message: "Checkin deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};