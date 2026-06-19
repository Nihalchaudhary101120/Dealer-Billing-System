import part from "../models/part.js";

export const addPart = async(req,res)=>{
    try{
        const {itemNo, particulars,rate,hsn}=req.body;

        if(!itemNo || !particulars || !rate || !hsn)return res.status(400).json({message:"fill all the fields",success:false});

        const exist= await part.findOne({itemNo});
        if(exist) return res.status(400).json({message: "item already present", success:false});

        const created = await part.create({itemNo,particulars,rate,hsn});
        if(!created) return res.status(400).json({message:"Error creating in parts" , success:false});

        res.status(200).json({created , message:"created Successfully",success:true});

    }catch(err){
        res.status(500).json({message:"Error creating part",error:err.message ,success:false});
    }
};

export const getAllPart = async(req,res)=>{
    try{
        const parts = await part.find();
        if(!parts) return res.status(404).json({message:"parts not found",success:false});
        res.status(200).json({parts,message:"parts fetched successfully", success:true});
    }catch(err){
        res.status(500).json({message:"Error fetching parts",error:err.message});
    }
};

export const updatePart = async (req,res)=>{
    try{
        const updated = await part.findByIdAndUpdate(req.params.id,req.body ,{
            new:true,
            runValidators:true
        });
        if(!updated) return res.status(404).json({message:"part not found", success:false});
        res.status(200).json({updated,message:"updated successfully",success:true});
    }catch(err){
        res.status(500).json({message:"Error updating Part",error:err.message});
    }
};

export const deletePart = async(req,res)=>{
    try{
         const deleted = await part.findByIdAndDelete(req.params.id);
         if(!deleted) return res.status(404).json({message : "part not found",success:false});
         res.status(200).json({message:"part record deleted",success:true});
    }catch(err){
        res.status(500).json({message:"Error deleting part",error :err.message});
    }
};