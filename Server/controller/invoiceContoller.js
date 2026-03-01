import invoice from "../models/invoice.js";

export const addInvoice = async (req, res) => {
    try {
        const { status, customerName, customerFatherName, customerAddress, customerDistrict, customerState, customerPhone, customerGstNumber, billType, isHp, financeCompany, bike, chassisNumber, engineNumber, discount, taxableAmount, scheme, cgst, sgst, totalAmount, dealer, createdBy, lockedAt } = req.body;

        if (!status || !customerName || !customerFatherName || !customerAddress || !customerDistrict || !customerState || !customerPhone || !billType || !bike || !chassisNumber || !engineNumber || !taxableAmount || !cgst || !sgst || !totalAmount || !dealer || !createdBy || !lockedAt) return res.status(400).json({ message: "Fill all the fields", success: false });

        const exist = await invoice.findOne({ invoiceNumber, invoiceDate });
        if (exist) return res.status(400).json({ message: "invoice record already exist", success: false });

        const today = new Date();
        const currentYear = today.getFullYear();
        const firstApril = new Date(currentYear, 3, 1);

        let latestInvoice = {};
        let created = {};
        if (status === "FINAL") {
            latestInvoice = await invoice
                .findOne({
                    status: "FINAL",
                    invoiceDate: { $gte: firstApril }
                })
                .sort({ invoiceNumber: -1 });

            created = await invoice.create({ invoiceNumber: (latestInvoice.invoiceNumber + 1), invoiceDate: today, status, customerName, customerFatherName, customerAddress, customerDistrict, customerState, customerPhone, billType, isHp, financeCompany, customerGstNumber, bike, chassisNumber, engineNumber, discount, taxableAmount, cgst, sgst, totalAmount, dealer, createdBy, lockedAt, scheme });
        } else {
            created = await invoice.create({ status, customerName, customerFatherName, customerAddress, customerGstNumber, scheme, customerDistrict, customerState, customerPhone, billType, isHp, financeCompany, bike, chassisNumber, engineNumber, discount, taxableAmount, cgst, sgst, totalAmount, dealer, createdBy, lockedAt });
        }

        if (!created) res.status(400).json({ message: "Error creating invoice", success: false });

        res.status(200).json({ created, message: "Invoice created successfully", success: true });

    } catch (err) {
        res.status(500).json({ message: "Error creating invoice ", error: err.message, success: false });
    }
};

export const getAllInvoice = async (req, res) => {
    try {
        const data = await invoice.find();
        if (!data) return res.status(404).json({ message: "No invoice found", success: false });

        res.status(200).json({ data, message: "Invoice fetched successfully", success: true });

    } catch (err) {
        res.status(500).json({ message: "Error Fetching Invoice", error: err.message });

    }
};

// export const updateInvoice = async (req, res) => {
//     try {
//         const { id } = req.params.id;
//         const { status, customerName, customerFatherName, customerAddress, customerDistrict, customerState, customerPhone, customerGstNumber, billType, isHp, financeCompany, bike, chassisNumber, engineNumber, discount, taxableAmount, scheme, cgst, sgst, totalAmount, dealer, createdBy, lockedAt } = req.body;

//         let old = await invoice.findById(id);
//         if (!old) return res.status(404).json({ message: "Invoice not found", success: false });

//         const today = new Date();
//         const currentYear = today.getFullYear();
//         const firstApril = new Date(currentYear, 3, 1);

//         let latestInvoice = {};
//         let updated = {};
//         if (status === "FINAL" && old.status === "DRAFT") {
//             latestInvoice = await invoice
//                 .findOne({
//                     status: "FINAL",
//                     invoiceDate: { $gte: firstApril }
//                 })
//                 .sort({ invoiceNumber: -1 });

//             old.invoiceNumber = latestInvoice.invoiceNumber + 1;
//             old.invoiceDate = today;
//             old.status = status;
//             old.customerName = customerName;
//             old.customerAddress = customerAddress;
//             old.customerDistrict = customerDistrict;
//             old.customerState = customerState;
//             old.customerFatherName = customerFatherName;
//             old.customerPhone = customerPhone;
//             old.customerGstNumber = customerGstNumber;
//             old.


//             updated = await old.save();
//         } else {
//             created = await invoice.create({ status, customerName, customerFatherName, customerAddress, customerGstNumber, scheme, customerDistrict, customerState, customerPhone, billType, isHp, financeCompany, bike, chassisNumber, engineNumber, discount, taxableAmount, cgst, sgst, totalAmount, dealer, createdBy, lockedAt });
//         }


//         if (!updated) return res.status(404).json({ message: "invoice not found", success: false });
//         res.status(200).json({ updated, message: "Updated successfully", success: true });
//     }
//     catch (err) {
//         res.status(500).json({ message: "Error updating Invoice", error: err.message });
//     }
// };


export const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            status,
            customerName,
            customerFatherName,
            customerAddress,
            customerDistrict,
            customerState,
            customerPhone,
            customerGstNumber,
            billType,
            isHp,
            financeCompany,
            bike,
            chassisNumber,
            engineNumber,
            discount,
            taxableAmount,
            scheme,
            cgst,
            sgst,
            totalAmount,
            dealer,
            createdBy,
            lockedAt
        } = req.body;

        const old = await invoice.findById(id);
        if (!old) {
            return res.status(404).json({
                message: "Invoice not found",
                success: false
            });
        }

        const today = new Date();
        const currentYear = today.getFullYear();
        const firstApril = new Date(currentYear, 3, 1);

        // 🔥 If converting DRAFT → FINAL
        if (status === "FINAL" && old.status === "DRAFT") {

            const latestInvoice = await invoice
                .findOne({
                    status: "FINAL",
                    invoiceDate: { $gte: firstApril }
                })
                .sort({ invoiceNumber: -1 });

            const nextInvoiceNumber = latestInvoice
                ? latestInvoice.invoiceNumber + 1
                : 1; // first invoice of financial year

            old.invoiceNumber = nextInvoiceNumber;
            old.invoiceDate = today;
            old.status = "FINAL";
        }

        // 🔥 Update remaining fields (for both cases)
        old.customerName = customerName;
        old.customerFatherName = customerFatherName;
        old.customerAddress = customerAddress;
        old.customerDistrict = customerDistrict;
        old.customerState = customerState;
        old.customerPhone = customerPhone;
        old.customerGstNumber = customerGstNumber;
        old.billType = billType;
        old.isHp = isHp;
        old.financeCompany = financeCompany;
        old.bike = bike;
        old.chassisNumber = chassisNumber;
        old.engineNumber = engineNumber;
        old.discount = discount;
        old.taxableAmount = taxableAmount;
        old.scheme = scheme;
        old.cgst = cgst;
        old.sgst = sgst;
        old.totalAmount = totalAmount;
        old.dealer = dealer;
        old.createdBy = createdBy;
        old.lockedAt = lockedAt;

        const updated = await old.save();

        return res.status(200).json({
            updated,
            message: "Inoice Updated successfully",
            success: true
        });

    } catch (err) {
        return res.status(500).json({
            message: "Error updating Invoice",
            error: err.message
        });
    }
};

export const deleteInvoice = async (req, res) => {
    try {
        const deleted = await invoice.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Invoice not Found", success: false });
        res.status(200).json({ message: "Invoice record deleted", success: true });
    }
    catch (err) {
        res.status(500).json({ message: "Error deleting Invoice", error: err.message });
    }
};
