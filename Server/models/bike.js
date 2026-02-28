import mongoose from 'mongoose';

const BikeModelSchema = new mongoose.Schema({
    brand: { type: String, default: "TVS" },
    modelName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BikeModel",
        required: true
    },

    variant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BikeVarient",
        required: true
    },

    colorOptions: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BikeColor",
        required: true
    },
    basePrice: { type: Number, required: true },
    hsnCode: { type: String, default: "87112029" },
}, { timestamps: true });

export default mongoose.model("Bike", BikeModelSchema);