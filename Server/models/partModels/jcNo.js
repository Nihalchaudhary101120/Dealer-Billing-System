import mongoose from 'mongoose';

const jcNoSchema = new mongoose.Schema({
    jcNo: { type: String , required :true}
},{timeStamps:true});

export default mongoose.model("jcNo",jcNoSchema);