import mongoose from 'mongoose';

const partInvoiceSchema = new mongoose.Schema({
    invoiceNo: {
        type: Number,
        required: true,
        unique: true
    },  
    invoiceDate: {
        type: Date,
        default: Date.now
    },
    dealer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "dealer"
    },
    customer: {
        name: String,
        mobile: Number,
        address: String,
        gst: String
    },

    billTo: {
       type:mongoose.Schema.Types.ObjectId,
       ref:"billTo"
    },

    billType: {
        type: String,
        default: "CREDIT",
    },

    jcNo: {
        type: Number,
        required: true,
    },
    vehicle: {
        regnNo: String,
        kms: Number,
        frameNo: String,
    },

    BikeModel: {
        modelName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BikeModel",
            required: true
        },
        variant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BikeVarient"
        },
        
    },

    service: {
        jobType: String,
        mechanic: String,
        nxtDue: String,
        nxtDueDt: Date,
    },

    parts: [
        {
            part: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "part",
                required: true
            },
            qty: {
                type: Number,
                default: 1
            },
            rate: {
                type: Number,
                required: true
            },
            discount: {
                type: Number,
                default: 0,
            },
            hsn: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "hsn"
            },
            taxable: Number,
            sgstPercent: Number,
            sgstAmount: Number,
            cgstPercent: Number,
            cgstAmount: Number,
            amount: Number,
            mrp: Number,

        }
    ],

    labours: [
        {
            particulars: String,

            qty: {
                type: Number,
                default: 1,
            },

            rate: Number,

            discount: {
                type: Number,
                default: 0,
            },

            taxable: Number,

            sgstPercent: Number,

            sgstAmount: Number,

            cgstPercent: Number,

            cgstAmount: Number,

            amount: Number,
        },
    ],
    summary: {
        partsQty: Number,

        labourQty: Number,

        taxableTotal: Number,

        sgstTotal: Number,

        cgstTotal: Number,

        grandTotal: Number,

        netTotal: Number,
    },

},{
    timestamps:true
});

export default mongoose.model("partInvoice",partInvoiceSchema);