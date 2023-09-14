const express=require('express')
const { login, createUser, createAdmin, getAlluser, createBank, getAllBank, createAcc, getUserById, getAccountById, depositeAmount, withdrawAmount, transferAmount, transaction, worth, logout }=require('./controller/User')
const User=require('./User')
require('dotenv').config()
const application=express()
const cookieParser=require('cookie-parser')
const { errorHandler } = require('./middleWare/ErrorHandler')
const JwtAuthentication = require('./middleWare/JwtAuthentication')
application.use(express.json())
application.use(cookieParser())
const mainRouter=express.Router()
const guarded=express.Router()
const unguarded=express.Router()
const adminRouter=express.Router()
const userRouter=express.Router()


application.use('/api/v1/banking-app',mainRouter)
mainRouter.use('/',guarded)
mainRouter.use('/',unguarded)
guarded.use('/admin/user',adminRouter)
guarded.use('/user',userRouter)
adminRouter.use(JwtAuthentication.isAdmin)
userRouter.use(JwtAuthentication.isUser)
const accountRouter=express.Router({mergeParams:true})
userRouter.use('/:userid/account',accountRouter)


unguarded.post('/createadmin',createAdmin)        // /api/v1/banking-app/createadmin
unguarded.post("/login",login)     //  /api/v1/banking-app/login
unguarded.post("/logout",logout)   // //api/v1/banking-app/login
adminRouter.post('/',createUser)    // /api/v1/banking-app/admin/user
adminRouter.get('/',getAlluser)    // /api/v1/banking-app/admin/user
adminRouter.get('/:id',getUserById)     // /api/v1/banking-app/admin/user/:userid
adminRouter.get('/bank/allbank',getAllBank)       // /api/v1/banking-app/admin/user/allbank
adminRouter.post('/createbank',createBank)          // /api/v1/banking-app/admin/user
accountRouter.post('/:bankid',createAcc)         // //api/v1/banking-app/user/:userid/account/:bankId
accountRouter.get('/',getAccountById)              //api/v1/banking-app/user/:userid/account
accountRouter.post('/:accountid/deposite',depositeAmount)  //api/v1/banking-app/user/:userid/account/:accountid/deposite
accountRouter.post('/:accountid/withdraw',withdrawAmount)   //api/v1/banking-app/user/:userid/account/:accountid/withdraw
accountRouter.post('/:fromAccountNo/transfer/:toAccountNo',transferAmount)   ///api/v1/banking-app/user/:userid/account/:fromAccountNo/transfer/:toAccountNo
accountRouter.post('/:accountNumber/transaction',transaction) //api/v1/banking-app/user/:userid/account/:accountNumber/transaction


application.use(errorHandler)
application.listen(1548,()=>{
    // User.newAdmin("akshay", 23, "male", true,"Akshay","password")
    // User.newUser("shubham",23,"male",false,"Aksha","password")
    
    console.log("server run on 1548 port");
})