import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({

    invoiceNumber: { type: Number, default: null },
    invoiceDate: { type: Date, default: null },
    status: {
        type: String,
        enum: ["DRAFT", "FINAL", "CANCELLED"],
        default: "DRAFT"
    },  


    //customer info 
    customerName:{
        type:String,
        required:true
    },

    customerFatherName:{
         type:String,
         required:true
    },

    customerAddress:{
        type:String,     
    },
    customerDistrict:{
        type:String
    },
    customerState:{
        type:String
    },
    customerPhone:{
        type:Number
    },
    billType:{
          type:String,
          enum:["Cash" , "Credit"],
          default:"Cash"  
    },
    isHp:{
        type:Boolean,
        default:false
    },
    financeCompany:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"bank",
        default:null
    },

    bikeModel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"BikeModel",
        required:true   
    },

    chassisNumber:{
        type:String,
        required:true,
        unique:true
    },
    engineNumber:{
        type:String,
        required:true,
        unique:true
    },


    //logic
    discount:{
        type:Number,
        default:0
    },

    taxableAmount:{
        type:Number
    },
    cgst:{
        type:Number
    },
    sgst:Number,
    totalAmount:Number,

    dealer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:dealer
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    lockedAt:{
        type:Date,
        default:null
    }

}, { timestamps: true });

export default mongoose.model("invoice",InvoiceSchema);