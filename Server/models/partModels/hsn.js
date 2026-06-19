import mongoose from 'mongoose';

const HsnSchema= new mongoose.Schema({

    forWhat:{type:String , required:true},
    hsnCode:{type:String , required:true}

},{ timestamps : true});

export default mongoose.model("hsn",HsnSchema);