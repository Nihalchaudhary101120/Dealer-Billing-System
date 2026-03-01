import { schemeModel } from "../models/bikeSpecifications.js"

export const addScheme = async (req, res) => {
    try {
        const { scheme, fromDate, toDate, toBike } = req.body;
        if (!scheme || !fromDate || !toDate || !toBike) return res.status(400).json({ message: "All fields are required", success: false });
        const exist = await schemeModel.findOne({ scheme, fromDate, toDate, toBike });
        if (exist) return res.status(400).json({ message: "scheme already exist for this bike", success: false });
        const created = await schemeModel.create({ scheme, fromDate, toBike, toDate });
        res.status(200).json({ created, message: "Created successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Error adding scheme", success: false, error: err.message });
    }
};

export const getAllScheme = async (req, res) => {
    try {
        const today = new Date();
        const currentyear = today.getFullYear();
        const firstApril = new Date(currentyear, 3, 1);
        const schemes = await schemeModel.find({ fromDate: { $gte: firstApril } });
        if (!schemes) return res.status(404).json({ message: "No scheme found for this year", success: false });
        res.status(200).json({ schemes, message: "schemes fetched sucessfully for this year", success: true });
    } catch (err) {
        res.status(500).json({ message: "Error fetching schemes", success: false, error: err.message });
    }
};

export const updateScheme = async (req, res) => {
    try {
        const updated = await schemeModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updated) return res.status(404).json({ message: "scheme not found", success: false });

        res.status(200).json({ message: "updated successfully", updated, success: true });
    } catch (err) {
        res.status(500).json({ message: "Error updating scheme", success: false, error: err.message });

    }
};

export const deleteScheme = async (req, res) => {
    try {
        const deleted = await schemeModel.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(400).json({ message: "scheme not found", success: false });
        res.status(200).json({ message: "deleted successfully", success: true });
    }
    catch (err) {
        res.status(500).json({ message: "Error deleting scheme", success: false, error: err.message });
    }
};