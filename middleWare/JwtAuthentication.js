const User=require('../User')
const jwt=require('jsonwebtoken');
const { UnauthorizedError } = require('../error');
require('dotenv').config()
class JwtAuthentication{
   static key="Random key" 
    constructor(id,userName,isAdmin){
        this.id=id;
        this.userName=userName;
        this.isAdmin=isAdmin;
    }
    static newJwtAuthentication(id,userName,isAdmin){
        let payload=new JwtAuthentication(id,userName,isAdmin)
        let token=jwt.sign(JSON.stringify(payload),process.env.JWT_SECRET_KEY)
        return token

    }
    static verifyToken(token){
        try {
            let payload=jwt.verify(token,process.env.JWT_SECRET_KEY)
            return payload
        } catch (error) {
            throw error
        }
    }
    static isAdmin(req,res,next){
       try {
        
        let token=req.cookies[process.env.AUTH_COOKIE_NAME]

        if(!token){
            throw new UnauthorizedError("unauthorize error")
        }
        let payload=JwtAuthentication.verifyToken(token)
        if(payload.isAdmin){
            next()
        }
        else{
            throw new UnauthorizedError("you are not admins")
        }
        
       } catch (error) {
        throw error
       }
        
    }
    static isUser(req,res,next){
        try {
         let token=req.cookies[process.env.AUTH_COOKIE_NAME]
         
         if(!token){
             throw new UnauthorizedError("unauthorize error")
         }
         let payload=JwtAuthentication.verifyToken(token)
         if(!payload.isAdmin){
             next()
         }
         else{
             throw new UnauthorizedError("you are not user")
         }
         
        } catch (error) {
         throw error
        }
         
     }
}
module.exports=JwtAuthentication