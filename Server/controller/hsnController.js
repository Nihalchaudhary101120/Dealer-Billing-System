import hsn from "../models/partModels/hsn";

export const addHsn = async (req, res) => {
    try {
        const { forWhat, hsnCode } = req.body;

        if (!forWhat || !hsnCode) return res.status(400).json({ message: "fill all the field ", success: false });

        const exist = await hsn.findOne({ forWhat });
        if (exist) return res.status(400).json({ message: "Hsn already present ", success: false });

        const created = await hsn.create({ forWhat, hsnCode });
        if (!created) return res.status(400).json({ message: "Error creating in Hsn", success: false });

        res.status(200).json({ created, message: "created SuccessFully", success: true });


    } catch (err) {
        res.status(500).json({ message: "Error creating hsn ", error: err.message, success: false });
    }
};
export const getAllHsn = async (req, res) => {
    try {
        const hsns = await hsn.find();
        if (!hsns) return res.status(404).json({ message: "hsns not found", success: false });
        res.status(200).json({ hsns, message: "HSN fetched successfully ", success: true });
    } catch (err) {
        res.status(500).json({ message: "Error fetching HSN", error: err.message });
    }
};

export const updateHsn = async (req, res) => {
    try {
        const updated = await hsn.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updated) return res.status(404).json({ message: "HSN not found", success: false });
        res.status(200).json({ updated, message: "updated successfully", success: true });

    } catch (err) {
        res.status(500).json({ message: "Error updating Hsn", error: err.message });
    }
};

export const deleteHsn = async (req, res) => {
    try {
        const deleted = await hsn.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Hsn not found", success: false });
        res.status(200).json({ message: "Hsn record deleted", success: true });

    } catch (err) {
        res.status(500).json({ message: "Error deleting Hsn", error: err.message });
    }
};