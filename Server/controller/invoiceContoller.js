import invoice from "../models/invoice.js";

export const addInvoice = async (req, res) => {
    try {
        let {
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
            dealer
        } = req.body;

        // convert empty financeCompany string to null so mongoose cast succeeds
        if (financeCompany === "") financeCompany = null;

        // simple required‑field check; avoid coercing 0 or '' to false where appropriate
        if (!status || !customerName || !customerFatherName || !customerDistrict || !customerState || !customerPhone || !billType || !bike || !chassisNumber || !engineNumber || taxableAmount == null || cgst == null || sgst == null || totalAmount == null || !dealer) {
            return res.status(400).json({ message: "Fill all the required fields", success: false });
        }

        // don't try to find by undefined invoiceNumber/date – instead check for duplicate chassis/engine
        const existingChassis = await invoice.findOne({ chassisNumber });
        if (existingChassis) {
            return res.status(400).json({ message: "Chassis number already used", success: false });
        }
        const existingEngine = await invoice.findOne({ engineNumber });
        if (existingEngine) {
            return res.status(400).json({ message: "Engine number already used", success: false });
        }

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

            created = await invoice.create({ invoiceNumber: (latestInvoice.invoiceNumber + 1), invoiceDate: today, status, customerName, customerFatherName, customerAddress, customerDistrict, customerState, customerPhone, billType, isHp, financeCompany, customerGstNumber, bike, chassisNumber, engineNumber, discount, taxableAmount, cgst, sgst, totalAmount, dealer, scheme });
        } else {
            created = await invoice.create({ status, customerName, customerFatherName, customerAddress, customerGstNumber, scheme, customerDistrict, customerState, customerPhone, billType, isHp, financeCompany, bike, chassisNumber, engineNumber, discount, taxableAmount, cgst, sgst, totalAmount, dealer, });
        }

        if (!created) res.status(400).json({ message: "Error creating invoice", success: false });

        res.status(200).json({ created, message: "Invoice created successfully", success: true });

    } catch (err) {
        console.error("addInvoice error", err);
        return res.status(500).json({ message: "Error creating invoice", error: err.message || err, success: false });
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
//         const { status, customerName, customerFatherName, customerAddress, customerDistrict, customerState, customerPhone, customerGstNumber, billType, isHp, financeCompany, bike, chassisNumber, engineNumber, discount, taxableAmount, scheme, cgst, sgst, totalAmount, dealer,  } = req.body;

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
        const firstApril = new Date(currentYear, 2, 1);

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
        old.financeCompany = financeCompany || null;
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

        // ensure financeCompany is null if blank on updates as well
        if (financeCompany === "") old.financeCompany = null;
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

export const getAllDraft = async (req, res) => {
    try {
        const today = new Date();
        const currentYear = today.getFullYear();
        const firstApril = new Date(currentYear, 2, 1);

        const drafts = await invoice.find({ status: "DRAFT", createdAt: { $gte: firstApril } });
        if (!drafts) return res.status(404).json({ message: "No drafts found", success: false });
        res.status(200).json({ message: "Drafts fetched", drafts, success: true });
    } catch (err) {
        res.status(500).json({ message: "Error fetching drafts", success: false, error: err.message });
    }
};

export const getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "No invoice found", success: false });
        const draftInvoice = await invoice.findById(id).populate({
            path: "bike",
            populate: [
                { path: "modelName" },
                { path: "variant" },
                { path: "colorOptions" }
            ]
        });

        if (!draftInvoice) return res.status(404).json({ message: "No invoice found", success: false });
        res.status(200).json({ message: " Drafted Invoice fetched successfully", draftInvoice, success: true });
    }
    catch (err) {
        res.status(500).json({ message: "Error to fetched drafted Invoice", error: err.message });
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


export const printInvoice = async (req, res) => {
    try {

        const { startDate, endDate } = req.body;
        if ((!startDate || !endDate)&&(startDate<=endDate)) return res.status(400).json({ message: "All Field are reequired", success: false });

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const inv =await invoice.find({status:"FINAL",date:{$gte:start,$lte:end}});

        if(!inv) return res.status(404).json({message:"No invoice found",success:false});

        res.status(200).json({message:"invoice fetched successfully",inv,success:true});

    }
    catch (err) {
        res.status(500).json({message:"Error fetching Invoice",error:err.message});
    }
};