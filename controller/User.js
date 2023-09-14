const User=require('../User')
const Bank=require('../Bank')
require('dotenv').config()
const jwt=require('../middleWare/JwtAuthentication')
const {errorHandler}=require('../middleWare/ErrorHandler')
const bcrypt = require('bcrypt');
const { ValidationError } = require('../error')

const login=async(req,res,next)=>{
    try {
        const{userName,password}=req.body
        if(typeof userName!="string"){
            throw new ValidationError("invalid username")
        }
        if(typeof password!="string"){
            throw new ValidationError("invalid password")
        }
        let token=User.getAuthenticate(userName,password)
        
        res.cookie(process.env.AUTH_COOKIE_NAME,await token)
   
        res.status(200).send("login sucessfully")
    } catch (error) {
        next(error)
        
    }
    
}
const logout=async(req,res,next)=>{
try {
    const{userName,password}=req.body
    if(typeof userName!="string"){
        throw new ValidationError("invalid username")
    }
    if(typeof password!="string"){
        throw new ValidationError("invalid password")
    }
    let token=User.getAuthenticate(userName,password)
    
    res.cookie(process.env.AUTH_COOKIE_NAME,await token,{
        expires:new Date()

    })

    res.status(200).send("logout sucessfully")
} catch (error) {
    next(error)
}
}
const createUser=async(req,res,next)=>{
    
        try {
            const { name, age, gender, isAdmin,userName,password } = req.body;
            let createUsers = await User.newUser(name, age, gender, isAdmin,userName,password);
            res.status(200).send(createUsers);
        } catch (error) { 
            next(error);
        }
    
}
const createAdmin=async(req,res,next)=>{
    
    try {
        const { name, age, gender, isAdmin,userName,password } = req.body;
        let createUsers = await User.newAdmin(name, age, gender, isAdmin,userName,password);
        res.status(200).send(createUsers);
    } catch (error) { 
        next(error);
    }

}
const getAlluser=(req,res,next)=>{
    try {
        console.log("akshay");
        let alluser=User.getAllUsers()
        res.status(200).send(alluser)
    } catch (error) {
        next(error)
    }
}
const getUserById=(req,res,next)=>{
    try{
        let{id}=req.params
        
        
        let getUser=User.findUser(id)
        res.status(200).send(getUser)

    }
    catch(error){
        next(error)
    }
}
const createBank=(req,res,next)=>{
    try {
        let{bankName}=req.body
        
    let createBankObj=User.newBank(bankName)
    res.status(200).send(createBankObj)
    } catch (error) {
        next(error)
    }
}
const getAllBank=(req,res,next)=>{
    try {
        let allBank=User.getAllBanks()
        res.status(200).send(allBank)
        
    } catch (error) {
        next(error)
    }
}
const createAcc=(req,res,next)=>{
    try {
        let{userid,bankid}=req.params
     
        let findUserObj=User.findUser(userid)
       
        let createdAc=findUserObj.newAccount(bankid)
        res.status(200).send(createdAc)
    } catch (error) {
        next(error)
    }
}
const getAccountById=(req,res,next)=>{
    try {
        let{userid}=req.params
       let foundUser= User.findUser(userid)
       let showAccounts=foundUser.getAccounts()
       res.status(200).send(showAccounts)

    } catch (error) {
        throw error
        
    }
}
const depositeAmount=(req,res,next)=>{
    try {
        let{userid,accountid}=req.params
        let{amount}=req.body
        let findUserObj=User.findUser(userid)
        let deposited=findUserObj.deposite(accountid,amount)
        res.status(200).send(deposited)
     

    } catch (error) {
        
        next(error)
    }

}
const withdrawAmount=(req,res,next)=>{
    try{
        let{userid,accountid}=req.params
        let{amount}=req.body
        let findUserObj=User.findUser(userid)
        let withdrawlAmount=findUserObj.withdraw(accountid,amount)
        res.status(200).send(withdrawlAmount)
    }
    catch(error){
    next(error)
    }
}
const transferAmount=(req,res,next)=>{
    try {
        let{userid,fromAccountNo, toAccountNo}=req.params
        let{amount}=req.body
        let findUserObj1=User.findUser(userid)
        let transferAmount=findUserObj1.transfer(fromAccountNo, toAccountNo,amount)
        res.status(200).send(transferAmount)  
    } catch (error) {
        next(error)
        
    }
}
const transaction=(req,res,next)=>{
    try {
        console.log("**************************************");
        let{userid,accountNumber}=req.params
        let{startDate,endDate}=req.body
        console.log(req.query);
        let findUserObj2=User.findUser(userid)
        console.log(findUserObj2);
        let getTransactiontodate=findUserObj2.getAccountTransactionsByDate(accountNumber, startDate, endDate)
        console.log(getTransactiontodate);
        res.status(200).send(getTransactiontodate)
    
        
    } catch (error) {
        next(error)
        
    }
}
const worth=(req,res,next)=>{
    try {
        console.log("akshay");
        let{userid}=req.params
        console.log(userid);
        console.log("pawar");
        let findUserObj3=User.findUser(userid)
        console.log(findUserObj3);
        let totalWorth=findUserObj3.getNetWorth()
        console.log(totalWorth);
        res.status(200).send(totalWorth)
    } catch (error) {
        next(error)
    }
}



module.exports={login,createUser,createAdmin,getAlluser,createBank,getAllBank,createAcc,getUserById,getAccountById,depositeAmount,withdrawAmount,transferAmount,transaction,worth,logout}

