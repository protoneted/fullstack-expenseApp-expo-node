import ratelimit from "../config/upstash.js";

export const rateLimiter = async(req,res,next) => {
    try {
        const {success} = await ratelimit.limit("my-rate-limiter"); //userId, ip address
        if (!success) {
            return res.status(429).json({message:"too many requests."})
        }
        next();
    } catch (error) {
        console.log("ratelimiter middleware error----------",error);
        return next(error)
    }
}