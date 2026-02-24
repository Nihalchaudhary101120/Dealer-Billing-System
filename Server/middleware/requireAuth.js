import User from '../models/user.js';

const requireAuth = async (req,res,next)=>{
    try{
        if(!req.session || !req.session.user){
            return res.status(401).json({
                success:false,
                message:"unauthorized: not logged in"
            });
        }
        const user = await User.findById(req.session.user.id).select('-password');

        if(!user){
            req.session.destroy(()=>{});
            return res.status(401).json({
                success:false,
                message:'Unauthorized : user not found'
            });
        }
        // 3️⃣ Attach user to request every routes can access now req.user
        req.user =user;
        next();

    }catch(error){
        console.error('Session auth error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};
export default requireAuth;