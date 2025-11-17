import Activity from '../models/activity.js';

export const getActivities = async (req, res) => {
    try {
        const relationshipId = req.params.id;
        const activities = await Activity.find({ relationshipId }).lean();
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving activities', error });
    }
};

export const createActivity = async (req, res) => {
    try {
        const newActivity = new Activity(req.body);
        const savedActivity = await newActivity.save();
        res.status(201).json(savedActivity);
    } catch (error) {
        res.status(500).json({ message: 'Error creating activity', error });
    }
};

export const getActivityById = async (req, res) => {
    try {
        const { id, activityId } = req.params;
        const activity = await Activity.findOne({ relationshipId: id, _id: activityId }).lean();
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.status(200).json(activity);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving activity', error });
    }
};
export const updateActivity = async (req, res) => {
    try {
        const { id, activityId } = req.params;
        const updatedActivity = await Activity.findOneAndUpdate(
            { relationshipId: id, _id: activityId },
            req.body,
            { new: true }
        );
        if (!updatedActivity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.status(200).json(updatedActivity);
    } catch (error) {
        res.status(500).json({ message: 'Error updating activity', error });
    }
};

export const deleteActivity = async (req, res) => {
    try {
        const { id, activityId } = req.params;
        const deletedActivity = await Activity.findOneAndDelete({ relationshipId: id, _id: activityId });
        if (!deletedActivity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.status(200).json({ message: 'Activity deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting activity', error });
    }
};