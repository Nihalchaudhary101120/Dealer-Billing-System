import mongoose from "mongoose";

const bikeColorSchema = new mongoose.Schema({
    color: { type: String, unique: true, required: true }
}, { timestamps: false });

const bikeVarientSchema = new mongoose.Schema({
    varient: { type: String, unique: true, required: true }
}, { timestamps: false });

const bikeModelSchema = new mongoose.Schema({
    model: { type: String, unique: true, required: true }
}, { timestamps: false });

const colorModel = mongoose.model("BikeColor", bikeColorSchema);
const modelModel = mongoose.model("BikeModel", bikeModelSchema);
const varientModel = mongoose.model("BikeVarient", bikeVarientSchema);

export { colorModel, varientModel, modelModel };