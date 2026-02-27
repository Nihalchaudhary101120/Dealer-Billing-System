import invoice from "../models/invoice.js";

export const addInvoice = async(req,res)=>{
    try{
          
        const {invoiceNumber,invoiceDate ,status,customerName , customerFatherName,customerAddress, customerDistrict , customerState,customerPhone ,billType,isHp,financeCompany ,bikeModel,chassisNumber,engineNumber , discount,taxableAmount,cgst,sgst,totalAmount , dealer,createdBy,lockedAt} =req.body;

        if(!invoiceNumber || !invoiceDate || !status || !customerName ||   !customerFatherName || !customerAddress || !customerDistrict || !customerState ||!customerPhone || !billType || !isHp || !financeCompany || !bikeModel || !chassisNumber || !engineNumber || !discount || !taxableAmount || !cgst || !sgst ||!totalAmount ||  !dealer || !createdBy || !lockedAt) return res.status(400).json({message : "Fill all the fields", success:false});

        const exist = await invoice.findOne({invoiceNumber , invoiceDate});
        if(exist) return res.status(400).json({message : "invoice record already exist",success:false});

        const created = await invoice.create({invoiceNumber,invoiceDate ,status,customerName , customerFatherName,customerAddress, customerDistrict , customerState,customerPhone ,billType,isHp,financeCompany ,bikeModel,chassisNumber,engineNumber , discount,taxableAmount,cgst,sgst,totalAmount , dealer,createdBy,lockedAt});

        if(!created) res.status(400).json({message : "Error creating invoice",success:false});

        res.status(200).json ({created,message:"Invoice created successfully",success:true});


    }catch(err){
        res.status(500).json({message:"Error creating invoice ",error:err.message ,success:false});
    }
};

export const getAllInvoice = async(req,res)=>{


    try{
        const invoice =await invoice.find();
        if(!invoice)return res.status(404).json({message:"No invoice found", success:false});

        res.status(200).json({invoice , message:"Invoice fetched successfully" ,success:true});

    }catch(err){
        res.status(500).json({message: "Error Fetching Invoice" , error :err.message});

    }
};

export const updateInvoice = async (req,res)=>{
    try{
        const updated= await invoice.findByIdAndUpdate(req.params.id , req.body , {
            new :true,
            runValidators:true
        });

        if(!updated) return res.status(404).json({message:"invoice not found" , success :false});
        res.status(200).json({updated ,message : "Updated successfully" ,success :true});
    }
    catch(err){
        res.status(500).json({message:"Error updating Invoice" , error : err.message});
    }
};

export const deleteInvoice = async(req,res)=>{
    try{
        const deleted = await invoice.findByIdAndDelete(req.params.id);
        if(!deleted) return res.status(404).json({message : "Invoice not Found", success:false});
        res.status(200).json({message:"Invoice record deleted" ,success:true});
    }
    catch(err){
        res.status(500).json({message:"Error deleting Invoice", error :err.message});
    }
};
