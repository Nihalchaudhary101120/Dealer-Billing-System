import JcNo from "../models/partModels/jcNo";

export const addJcNo= async(req,res)=>{
    try{
        const {jcNo} =req.body;

        if(!jcNo) return res.status(400).json({message:"Fill all the field",success:false});

        const exist = await JcNo.findOne({jcNo});
        if(exist) return res.status(400).json({message:"job card already present",success:false});
        const created = await JcNo.create({jcNo});
        if(!created)return res.status(400).json({message:"Error creating in Job card",success:false});

        res.status(200).json({created,message:"created SuccessFully",success:true});
    }
    catch(err){
        res.status(500).json({message:"Error creating job card number",error:err.message,success:false});
    }
};
export const getAllJcNo= async(req,res)=>{
    try{
        const jcNos = await JcNo.find();
        if(!jcNos) return res.status(404).json({message:"jcNos not found",success:false});
        res.status(200).json({jcNos,message:"job card fetched successfully ",success:true});
    }catch(err){
        res.status(500).json({message:"Error fetching Job card Number",error:err.message});
    }
};
export const updateJcNo= async(req,res)=>{
    try{
        const updated = await JcNo.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        if(!updated) return res.status(404).json({message:"JcNo not found",success:false});
        res.status(200).json({updated,message:"updated successfully",success:true});
    }catch(err){
        res.status(500).json({message:"Error updating JcNo",error: err.message});
    }
};

export const deleteJcNo = async(req,res) =>{
    try{
        const deleted = await JcNo.findByIdAndDelete(req.params.id);
        if(!deleted) return res.status(404).json({message:"Jc not found",success:false});
        res.status(200).json({message:"jc record deleted",success:true});
    }
    catch(err){
        res.status(500).json({message:"Error deleting Jc",error: err.message});
    }
};