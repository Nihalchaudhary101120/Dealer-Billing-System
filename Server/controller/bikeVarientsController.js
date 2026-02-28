import {varientModel} from "../models/bikeSpecifications.js";

export const addVarient = async (req, res) => {
    try {
        const { varient } = req.body;
        if (!varient) return res.status(400).json({ message: "varient is required", success: false });
        const exist = await varientModel.findOne({ varient });
        if (exist) return res.status(400).json({ message: "varient already exists", success: false });
        const created = await varientModel.create({ varient });
        res.status(200).json({ created, message: "Created successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Error adding varient", success: false, error: err.message });
    }
};

export const getAllVarient = async (req, res) => {
    try {
        const varients = await varientModel.find();
        if (!varients) return res.status(404).json({ message: "No varients found", success: false });
        res.status(200).json({ varients, message: "varients fetched sucessfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Error fetching varients", success: false, error: err.message });
    }
};

export const updateVarient = async (req, res) => {
    try {
        const updated = await varientModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updated) return res.status(404).json({ message: "varient not found", success: false });

        res.status(200).json({ message: "updated successfully", updated, success: true });
    } catch (err) {
        res.status(500).json({ message: "Error updating varient", success: false, error: err.message });
    }
};

export const deleteVarient = async (req, res) => {
    try {
        const deleted = await varientModel.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(400).json({ message: "varient not found", success: false });

        res.status(200).json({ message: "deleted successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Error deleting varient", success: false, error: err.message });
    }
};
