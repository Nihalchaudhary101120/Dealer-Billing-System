import billTo from "../models/partModels/billTo.js";

export const addBillTo = async (req, res) => {
    try {
        const { address, gstNo } = req.body;

        if (!address || !gstNo) return res.status(400).json({ message: "Fill all the field", success: false });

        const exist = await billTo.findOne({ gstNo });
        if (exist) return res.status(400).json({ message: "BillTo already present", success: false });

        const created = await billTo.create({ address, gstNo });
        if (!created) return res.status(400).json({ message: "Error creating in BillTo", success: false });

        res.status(200).json({ created, message: "created successfully", success: true });

    } catch (err) {
        res.status(500).json({ message: "Error creating BillTo", error: err.message, success: false });
    }
};
export const getAllBillTo = async (req, res) => {
    try {
        const billTos = await billTo.find();
        if (!billTos) return res.status(404).json({ message: "billTos not found", success: false });
        res.status(200).json({ billTos, message: "BILL TO fetched successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Error fetching Bill To", error: err.message });
    }
};


export const updateBillTo = async (req, res) => {
    try {
        const updated = await billTo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updated) return res.status(404).json({ message: "Bill To not found", success: false });
        res.status(200).json({ updated, message: "updated successfully", success: true });

    } catch (err) {
        res.status(500).json({ message: "Error updating Bill To  ", error: err.message });
    }
};

export const deleteBillTo = async (req, res) => {
    try {
        const deleted = await billTo.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Bill To not found", success: false });
        res.status(200).json({ message: "Bill To record deleted", success: true });

    } catch (err) {
        res.status(500).json({ message: "Error deleting Bill To", error: err.message });
    }
};