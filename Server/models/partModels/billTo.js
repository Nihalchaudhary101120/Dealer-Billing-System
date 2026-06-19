import mongoose from 'mongoose';

const BillToSchema = new mongoose.Schema({
    address:{type:String ,required :true},
    gstNo:{type:String ,required:true}

},{timestamps :true});

export default mongoose.model("billTo",BillToSchema);