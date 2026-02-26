import FinanceCompany from "../models/financeCompany.js";

export const addFinanceCompany = async (req, res) => {
    try {
        const { companyName, companyType, isActive } = req.body;
        if (!companyName || !companyType) return res.status(400).json({ message: "Fill all fields properly", success: true });
        const exist = await FinanceCompany.findOne({ companyName, companyType });
        if (exist) return res.status(400).json({ message: "Finance company already exist", success: false });

        const created = await FinanceCompany.create({ companyName, companyType, isActive: isActive || true });

        res.status(200).json({ created, message: "Finance company added successfully", success: true });

    } catch (err) {
        res.status(500).json({ message: "Error adding Finance company", success: false, error: err.message });
    }
};

export const getAllFinanceComapany = async (req, res) => {
    try {
        const data = await FinanceCompany.find();
        if (!data) return res.status(404).json({ message: "No Finance company", success: false });
        res.status(200).json({ message: "Finance companies fetched successfully", data, success: true });
    } catch (err) {
        res.status(500).json({ message: "Error fetching Finance companies", success: false, error: err.message });
    }
};

export const updateFinanceCompany = async (req, res) => {
    try {
        const updated = await FinanceCompany.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updated) return res.status(404).json({ message: "Finance company not found", success: false });

        res.status(200).json({ updated, message: "Updated Successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Error updating finance company", success: false, error: err.message });
    }
};

export const deleteFinancecompany = async (req, res) => {
    try {
        const deleted = await FinanceCompany.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Finance company not found", success: false });

        res.status(200).json({ message: "Finance company deleted successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Error deleting finance company", success: false, error: err.message });
    }
};




