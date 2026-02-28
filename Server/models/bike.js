import mongoose from 'mongoose';

const BikeModelSchema = new mongoose.Schema({
    brand: { type: String, default: "TVS" },
    modelName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BikeModel ",
        required: true
    },

    variant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BikeVariant",
        required: true
    },

    colorOptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "BikeColor"
    }],
    basePrice: { type: Number, required: true },
    hsnCode: { type: String, required: true, default: "87112029" },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Bike", BikeModelSchema);