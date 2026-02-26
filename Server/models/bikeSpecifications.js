import mongoose from "mongoose";

const bikeColorSchema = new mongoose.Schema({
    color: String
}, { timestamps: false });

const colorModel = mongoose.model("bike-color", bikeColorSchema);

const bikeVarientSchema = new mongoose.Schema({
    varient: String
}, { timestamps: false });

const varientModel = mongoose.model("bike-varient", bikeVarientSchema);

const bikeModelSchema = new mongoose.Schema({
    model: String
}, { timestamps: false });

const modelModel = mongoose.model("bike-model", bikeModelSchema);

export { colorModel, varientModel, modelModel };