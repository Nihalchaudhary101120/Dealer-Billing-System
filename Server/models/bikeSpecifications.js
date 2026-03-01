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

const bikeSchemeSchema = new mongoose.Schema({
    scheme: { type: String },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    toBike: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bike"
    },
    value: { type: Number, required: true }
}, { timestamps: false });

const colorModel = mongoose.model("BikeColor", bikeColorSchema);
const modelModel = mongoose.model("BikeModel", bikeModelSchema);
const varientModel = mongoose.model("BikeVarient", bikeVarientSchema);
const schemeModel = mongoose.model("BikeScheme", bikeSchemeSchema);

export { colorModel, varientModel, modelModel, schemeModel };