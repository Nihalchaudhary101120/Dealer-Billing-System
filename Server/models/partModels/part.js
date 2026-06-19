import mongoose from 'mongoose';

const PartSchema = new mongoose.Schema({
    itemNo:{type:String ,  required:true},
    particulars:{type:String , required:true},
    rate:{type:Number , required:true},
    hsn:{type:Number, required:true},

},{ timeStamps:true});

export default mongoose.model("part",PartSchema);