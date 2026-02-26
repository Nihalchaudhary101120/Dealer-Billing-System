import mongoose from 'mongoose';

const BikeModelSchema = new mongoose.Schema({

    brand:{type:String ,default:"TVS"},
    modelName:{type:String , required:true},
    variant:{type:String , required:true},
    basePrice:{type:Number , required:true},
    colorOptions:{type:String},
    hsnCode:{type:String,required:true,default:"87112029"},
    isActive:{type:Boolean},
    dealer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"dealer"
    }


}, { timestamps: true });

export default mongoose.model("BikeModel",BikeModelSchema );