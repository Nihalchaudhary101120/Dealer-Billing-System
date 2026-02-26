import mongoose from 'mongoose';

const DealerSchema = new mongoose.Schema({

    dealerName:{type:String , required:true},
    branchName:{type:String , required:true},
    nearBy:{type:String},
    address:{type:String},
    state:{type:String},
    phone:{type:Number},
    gstNumber:{type:String , required:true},
    isActive:{type:Boolean,default:true},

}, { timestamps: true });

export default mongoose.model("dealer",DealerSchema);