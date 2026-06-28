import PartInvoice from "../models/partModels/partInvoice.js";

export const addPartInvoice = async (req, res) => {
    try {
        const {
            dealer,
            billTo,
            billType,
            summary,
            labours,
            parts,
            service,
            BikeModel,
            vehicle,
            customer,
            jcNo
        } = req.body;

        if (!dealer || !summary || !service || !BikeModel || !vehicle || !customer || !jcNo) {
            return res.status(400).json({ message: "Fill all the required fields", success: false });
        }
        if ((!parts || parts.length === 0) &&
            (!labours || labours.length === 0)) {
            return res.status(400).json({
                success: false,
                message: "Add at least one part or labour"
            });
        }

        const exist = await PartInvoice.findOne({
            jcNo
        });

        if (exist) {
            return res.status(400).json({
                message: "Invoice already exists",
                success: false
            });
        }

        const today = new Date();
        const year = today.getMonth() < 3 ? today.getFullYear() - 1 : today.getFullYear();
        const firstApril = new Date(year, 3, 1);
        let latestInvoice = await PartInvoice.findOne({
            createdAt: { $gte: firstApril }
        }).sort({ invoiceNo: -1 });

        let invoiceNo = 1;
        if (latestInvoice) {
            invoiceNo = latestInvoice.invoiceNo + 1;
        }

        const created = await PartInvoice.create({
            invoiceNo: invoiceNo,
            dealer,
            billTo,
            billType,
            summary,
            labours,
            parts,
            service,
            BikeModel,
            vehicle,
            customer,
            jcNo

        });
        if (!created) return res.status(400).json({ message: "Error creating invoice", success: false });

        res.status(201).json({
            created,
            message: "Invoice created successfully",
            success: true
        });


    } catch (err) {
        res.status(500).json({
            message: "Error creating invoice",
            error: err.message,
            success: false
        });
    }
};

export const getAllPartInvoices = async (req, res) => {
    try {
        const invoices = await PartInvoice.find()
            .populate("dealer")
            .populate("billTo")
            .populate("BikeModel.modelName")
            .populate("BikeModel.variant")
            .populate("parts.part")
            .populate("parts.hsn")
            .sort({ createdAt: -1 });


        res.status(200).json({
            invoices,
            success: true
        });

    } catch (err) {
        res.status(500).json({
            message: "Error fetching invoices",
            error: err.message,
            success: false
        });

    }
};

export const getSingleInvoice = async (req, res) => {
    try {
        const invoice = await PartInvoice
            .findById(req.params.id)
            .populate("dealer")
            .populate("billTo")
            .populate("BikeModel.modelName")
            .populate("BikeModel.variant")
            .populate("parts.part")
            .populate("parts.hsn");

        if (!invoice) {
            return res.status(404).json({
                message: "Invoice not found",
                success: false
            });
        }

        res.status(200).json({
            invoice,
            success: true
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error fetching invoice",
            error: err.message,
            success: false
        });
    }
};

export const updatePartInvoice = async (req, res) => {
    try {
        const updated = await PartInvoice.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        if (!updated) {
            return res.status(404).json({
                message: "Invoice not found",
                success: false
            });
        }

        res.status(200).json({
            updated,
            message: "Invoice updated successfully",
            success: true
        });


    } catch (err) {
        return res.status(500).json({
            message: "Error updating Invoice",
            error: err.message
        });
    }
};

export const deletePartInvoice = async (req, res) => {
    try {

        const deleted = await PartInvoice.findByIdAndDelete(
            req.params.id
        );

        if (!deleted) {
            return res.status(404).json({
                message: "Invoice not found",
                success: false
            });
        }

        res.status(200).json({
            message: "Invoice deleted successfully",
            success: true
        });

    } catch (err) {

        res.status(500).json({
            message: "Error deleting invoice",
            error: err.message,
            success: false
        });

    }
};

export const printPartInvoice = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        if ((!startDate || !endDate) && (startDate <= endDate)) return res.status(400).json({ message: "All field are required", success: false });

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const inv = await PartInvoice.find({
            invoiceDate: {
                $gte: start,
                $lte: end
            }
        }).populate("dealer")
            .populate("billTo")
            .populate("BikeModel.modelName")
            .populate("BikeModel.variant")
            .populate("parts.part")
            .populate("parts.hsn");

        if (inv.length === 0) {
            return res.status(404).json({
                message: "No Invoice Found",
                success: false
            });
        }
        res.status(200).json({ message: "invoice fetched successfully", inv, success: true });
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching Invoice", error: err.message });
    }
};