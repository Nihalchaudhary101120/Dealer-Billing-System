import mongoose from 'mongoose';

const FinanceCompanySchema = new mongoose.Schema({

    companyName: { type: String, required: true, unique: true },
    companyType: { type: String, enum: ["BANK", "NBFC"], default: "NBFC" },
    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

export default mongoose.model("bank", FinanceCompanySchema);