import dealer from "../models/dealer.js";

export const addDealer = async(req,res)=>{
    try{
        const {dealerName ,branchName , nearBy , address ,state , phone ,gstNumber,isActive}=req.body;

        if(!dealerName || !branchName || !address || !state || !phone|| !gstNumber)return res.status(400).json({message:"Fill all fields",success:false});

        const exist = await dealer.findOne({dealerName , branchName});
        if(exist) return res.status(400).json({message: "Dealer already exist" , success:false});

        const created = await dealer.create({dealerName ,branchName, nearBy,address,state, phone,gstNumber,isActive});
        if(!created) return res.status(400).json({message:"Error creating in dealer",success:false});

        res.status(200).json({created , message: "created Successfully",success:true});

    }catch(err){
        res.status(500).json({message:"Error creating dealer",error:err.message ,success:false});
    }
};

export const getAllDealer = async(req,res)=>{
    try{
        const dealers=await dealer.find();
        if(!dealers)return res.status(404).json({message:"Dealers not found",success:false});
        res.status(200).json({dealers,message:"Dealers fetched successfully",success:true});

    }catch(err){
        res.status(500).json({message : "Error fetching dealers", error:err.message});
    }
};

export const updateDealer =async (req,res)=>{
    try{
        const updated = await dealer.findByIdAndUpdate(req.params.id , req.body , {
            new:true,
            runValidators :true
        });
        if(!updated) return res.status(404).json({message:"dealer not found",success:false});
        res.status(200).json({updated,message:"Updated successfully",success:true});
    }
    catch(err){
        res.status(500).json({message:"Error updating Dealer", error : err.message});
    }
};

export const deleteDealer =async(req,res)=>{
    try{
        const deleted = await dealer.findByIdAndDelete(req.params.id);
        if(!deleted) return res.status(404).json({message : "Dealer not Found",success:false});
        res.status(200).json({message:"Dealer record deleted", success:true});
    }
    catch(err){
        res.status(500).json({message:"Error deleting Dealer" , error :err.message});
    }
};