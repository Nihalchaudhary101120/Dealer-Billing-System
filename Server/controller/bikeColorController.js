import { colorModel } from "../models/bikeSpecifications.js";

export const addColor = async (req, res) => {
    try {
        const { color } = req.body;
        if (!color) return res.status(400).json({ message: "color is required", success: false });
        const exist = await colorModel.findOne({ color });
        if (exist) return res.status(400).json({ message: "color already exists", success: false });
        const created = await colorModel.create({ color });
        res.status(200).json({ created, message: "Created successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Error adding color", success: false, error: err.message });
    }
};

export const getAllColor = async (req, res) => {
    try {
        const colors = await colorModel.find();
        if (!colors) return res.status(404).json({ message: "No colors found", success: false });
        res.status(200).json({ colors, message: "Colors fetched sucessfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Error fetching colors", success: false, error: err.message });
    }
};

export const updateColor = async (req, res) => {
    try {
        const updated = await colorModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updated) return res.status(404).json({ message: "Color not found", success: false });

        res.status(200).json({ message: "updated successfully", updated, success: true });
    } catch (err) {
        res.status(500).json({ message: "Error updating color", success: false, error: err.message });
    }
};

export const deleteColor = async (req, res) => {
    try {
        const deleted = await colorModel.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(400).json({ message: "Color not found", success: false });

        res.status(200).json({ message: "deleted successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Error deleting color", success: false, error: err.message });
    }
};
