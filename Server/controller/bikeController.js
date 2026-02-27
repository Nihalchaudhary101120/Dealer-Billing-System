import Bike from "../models/bike.js";

export const addBike = async (req, res) => {
    try {
        const { brand, modelName, variant, basePrice, colorOptions, hsnCode, isActive } = req.body;

        if (!brand || !modelName || !variant || !basePrice || !colorOptions || !hsnCode) return res.status(400).json({ message: "Fill all fields", success: false });

        const exist = await Bike.findOne({ modelName, variant, colorOptions });
        if (exist) return res.status(400).json({ message: "Bike already exist", success: false });

        const created = await Bike.create({ brand, modelName, variant, basePrice, colorOptions, hsnCode, isActive });

        if (!created) return res.status(400).json({ message: "Error creating bike document", success: false });

        res.status(200).json({ created, message: "Bike Successfully added", success: true });

    } catch (err) {
        res.status(500).json({ message: "Error creating bike", success: false, error: err.message });
    }
};

export const getAllBike = async (req, res) => {
    try {
        const bikes = await Bike.find()
            .populate("modelName")
            .populate("variant")
            .populate("colorOptions");
        if (!bikes) return res.status(400).json({ message: "Bikes not found", success: false });
        res.status(200).json({ bikes, message: "Bikes fetched successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Error fetching bikes", success: false, error: err.message });
    }
};

export const updateBike = async (req, res) => {
    try {
        const updated = await Bike.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updated) return res.status(404).json({ message: "Bike not found", success: false });
        res.status(200).json({ updated, message: "Updated successfully", success: true });
    }
    catch (err) {
        res.status(500).json({ message: "Error updating Bike", success: false, error: err.message });
    }
};

export const deleteBike = async (req, res) => {
    try {
        const deleted = await Bike.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Bike record not found", success: false });
        res.status(200).json({ message: "Bike record deleted", success: true });
    }
    catch (err) {
        res.status(500).json({ message: "Error deleting bike", success: false, error: err.message });
    }
};



