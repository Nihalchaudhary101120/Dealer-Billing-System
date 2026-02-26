import { modelModel } from "../models/bikeSpecifications.js";

export const addModel = async (req, res) => {
    try {
        const { model } = req.body;
        if (!model) return res.status(400).json({ message: "model is required", success: false });
        const exist = await modelModel.findOne({ model });
        if (exist) return res.status(400).json({ message: "model already exists", success: false });
        const created = await modelModel.create({ model });
        res.status(200).json({ created, message: "Created successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Error adding model", success: false, error: err.message });
    }
};

export const getAllModel = async (req, res) => {
    try {
        const models = await modelModel.find();
        if (!models) return res.status(404).json({ message: "No colors found", success: false });
        res.status(200).json({ models, message: "Models fetched sucessfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Error fetching models", success: false, error: err.message });
    }
};

export const updateModel = async (req, res) => {
    try {
        const updated = await modelModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updated) return res.status(404).json({ message: "Model not found", success: false });

        res.status(200).json({ message: "updated successfully", updated, success: true });
    } catch (err) {
        res.status(500).json({ message: "Error updating model", success: false, error: err.message });
    }
};

export const deleteModel = async (req, res) => {
    try {
        const deleted = await modelModel.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(400).json({ message: "Model not found", success: false });

        res.status(200).json({ message: "deleted successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Error deleting color", success: false, error: err.message });
    }
};
