import { schemeModel } from "../models/bikeSpecifications.js"

export const addScheme = async (req, res) => {
    try {
        const { scheme, fromDate, toDate, toBike, value } = req.body;
        if (!scheme || !fromDate || !toDate || !toBike || !value) return res.status(400).json({ message: "All fields are required", success: false });
        const exist = await schemeModel.findOne({ scheme, fromDate, toDate, toBike });
        if (exist) return res.status(400).json({ message: "scheme already exist for this bike", success: false });
        let created = await schemeModel.create({ scheme, fromDate, toBike, toDate, value });
        created = await schemeModel.findById(created._id).populate("toBike");
        res.status(200).json({ created, message: "Created successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Error adding scheme", success: false, error: err.message });
    }
};

export const getAllScheme = async (req, res) => {
    try {
        const today = new Date();
        const year = today.getMonth() < 3
            ? today.getFullYear() - 1
            : today.getFullYear();

        const fyStart = new Date(year, 3, 1);
        const fyEnd = new Date(year + 1, 2, 31, 23, 59, 59);

        const schemes = await schemeModel.find({
            fromDate: { $gte: fyStart }
        }).populate("toBike");
        if (!schemes) return res.status(404).json({ message: "No scheme found for this year", success: false });
        res.status(200).json({ schemes, message: "schemes fetched sucessfully for this year", success: true });
    } catch (err) {
        res.status(500).json({ message: "Error fetching schemes", success: false, error: err.message });
    }
};

export const updateScheme = async (req, res) => {
    try {
        let updated = await schemeModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updated) return res.status(404).json({ message: "scheme not found", success: false });

        updated = await schemeModel.findById(updated._id).populate("toBike");

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