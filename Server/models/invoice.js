import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: Number, default: null },
    invoiceDate: { type: Date, default: null },
    status: {
        type: String,
        enum: ["DRAFT", "FINAL", "CANCELLED"],
        default: "DRAFT"
    },
    basePrice: {
        type: Number,
        required: true
    },

    customerName: {
        type: String,
        required: true
    },

    customerFatherName: {
        type: String,
        required: true
    },

    customerAddress: {
        type: String,
    },
    customerDistrict: {
        type: String
    },
    customerState: {
        type: String
    },
    customerPhone: {
        type: String
    },
    customerGstNumber: {
        type: String, trim: true,
        uppercase: true
    },
    billType: {
        type: String,
        enum: ["Cash", "Credit"],
        default: "Cash"
    },
    isHp: {
        type: Boolean,
        default: false
    },
    financeCompany: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bank",
        default: null
    },

    bike: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bike",
        required: true
    },

    chassisNumber: {
        type: String,
        required: true,
        unique: true, trim: true,
        uppercase: true
    },
    engineNumber: {
        type: String,
        required: true,
        unique: true, trim: true,
        uppercase: true
    },

    discount: {
        type: Number,
        default: 0
    },

    scheme: {
        type: String
    },

    taxableAmount: {
        type: Number,
        default:0   
    },
    cgst: {
        type: Number,
        default:0 
    },
    sgst: {type: Number,default:0 },
    totalAmount:{type: Number , default:0},

    dealer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "dealer"
    },


}, { timestamps: true });

export default mongoose.model("invoice", InvoiceSchema);