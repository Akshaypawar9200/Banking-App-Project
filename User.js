const Account = require("./Account");
const JwtAuthentication=require('./middleWare/JwtAuthentication')
const Bank = require("./Bank");
const {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
} = require("./error");
const bcrypt = require('bcrypt');
class User {
  static admin=null
  static userId = 0;
  static allUsers = [];
  constructor(name, age, gender, isAdmin,userName,password) {
    this.userId = User.userId++;
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.isAdmin = isAdmin;
    this.userName=userName;
    this.password=password;
    this.accounts = [];
    this.netWorth = 0;
  }
   /// CREATE admin///
   static async newAdmin(name, age, gender, isAdmin,userName,password) {
    try {
      if (typeof name != "string") {
        throw new ValidationError("invalid First Name");
      }
      if (typeof age != "number") {
        throw new ValidationError("invalid age");
      }
      if (typeof gender != "string") {
        throw new ValidationError("invalid gender");
      }
      let hashPassword=bcrypt.hash(password,12)
      if(User.admin!=null){
        return User.admin
      }
    
      User.admin= new User(name, age, gender, isAdmin,userName,await hashPassword);
      User.allUsers.push(User.admin)
      return User.admin;
    } catch (error) {
      throw  error;
    }
  }
// create user
  static async newUser(name, age, gender, isAdmin,userName,password) {
    try {
      
      if (typeof name != "string") {
        throw new ValidationError("invalid First Name");
      }
      if (typeof age != "number") {
        throw new ValidationError("invalid age");
      }
      if (typeof gender != "string") {
        throw new ValidationError("invalid gender");
      }
      let hashPassword=bcrypt.hash(password,12)
      let newUser = new User(name, age, gender, isAdmin,userName,await hashPassword);
      User.allUsers.push(newUser);
      return newUser;
    } catch (error) {
      throw error;
    }
  }
  // Utility Functions
  updateNetWorth() {
    let total = 0;
    for (let index = 0; index < this.accounts.length; index++) {
      total = total + this.accounts[index].AccountBalance;
    }
    this.netWorth = total;
    return this.netWorth;
  }

  getNetWorth() {
    return this.netWorth;
  }

  static findUser(userId) {
    
   try {
    for (let index = 0; index < User.allUsers.length; index++) {
      if (userId == User.allUsers[index].userId) {
        return User.allUsers[index];
      }
    }
    throw new NotFoundError("user not found")
    
   } catch (error) {
    throw error
   }
  }

  findUserAccount(accountNumber) {
    try {
      
      for (let index = 0; index < this.accounts.length; index++) {
        if (accountNumber == this.accounts[index].AccountNumber) {
          return [this.accounts[index], index];
        }
      }
      throw new NotFoundError("account not found")
      
    } catch (error) {
      throw error
    }
  }
  updateName(newValue) {
    try {
      if (typeof newValue != "string") {
        throw new ValidationError("Invalid name");
      }
      this.name = newValue;
    } catch (error) {
      throw error;
    }
  }

  updateAge(newValue) {
    try {
      if (typeof newValue != "number") {
        throw new ValidationError("Invalid Age");
      }
      this.age = newValue;
    } catch (error) {
      throw error;
    }
  }

  updateGender(newValue) {
    try {
      if (typeof newValue != "string") {
        throw new ValidationError("Invalid Gender");
      }
      this.gender = newValue;
    } catch (error) {
      throw error;
    }
  }

 

  /// READ user///
  static getAllUsers() {
    try {
      
      if (User.allUsers.length === 0) {
        throw new NotFoundError("Contact list is empty");
      }
      return User.allUsers;
    } catch (error) {
      throw error
    }
  }

  /// UPDATE user///
  updateUser(userId, parameter, newValue) {
    try {
      if (!this.isAdmin) {
        throw new UnauthorizedError("Only admin can update");
      }

      let userToBeUpdated = User.findUser(userId);
      if (userToBeUpdated == null) {
        throw new NotFoundError("User Not Found!");
      }

      switch (parameter) {
        case "name":
          userToBeUpdated.updateName(newValue);
          return userToBeUpdated;
        case "age":
          userToBeUpdated.updateAge(newValue);
          return userToBeUpdated;
        case "gender":
          userToBeUpdated.updateGender(newValue);
          return userToBeUpdated;
        default:
          throw new ValidationError("Invalid Parameter");
      }
    } catch (error) {
      return error;
    }
  }

  /// CREATE Bank///
  static newBank(bankName) {
    try {
      
      return Bank.newBank(bankName);
    } catch (error) {
      throw error;
    }
  }

  /// READ Bank///
  static getAllBanks() {
    try {

      if (Bank.allBanks.length === 0) {
        throw new NotFoundError("Bank list is empty");
      }
      return Bank.allBanks;
    } catch (error) {
      return error;
    }
  }

  /// UPDATE Bank///
  updateBank(bankId, parameter, newValue) {
    try {
      if (!this.isAdmin) {
        throw new UnauthorizedError("Only admin can update");
      }
      switch (parameter) {
        case "bankName":
          return Bank.updateBankName(bankId, newValue);
        default:
          throw new ValidationError("Invalid Parameter");
      }
    } catch (error) {
      return error;
    }
  }

  /// CREATE Account ///
  newAccount(bankId) {
    try {
      
      let [BankAccountCreateObj, index] = Bank.findBank(bankId);
      if (BankAccountCreateObj == null) {
        throw new NotFoundError("Bank Not Found");
      }

      let newAccount = Account.newAccount(
        BankAccountCreateObj.bankId,
        this.userId
      );

      this.accounts.push(newAccount);
      BankAccountCreateObj.accounts.push(newAccount);
      BankAccountCreateObj.updateBankTotal();
      this.updateNetWorth();
      return this;
    } catch (error) {
      return error;
    }
  }

  /// READ Account ///
   getAccounts() {
    try {
     
      return this.accounts;
    } catch (error) {
      throw error;
    }
  }

  /// User Deposit ///
  deposite(accountNumber, amount) {
    try {
  
     
      if (amount < 0) {
        throw new ValidationError("invalid Amount");
      }

      let [userAccount, accountIndex] = this.findUserAccount(accountNumber);
      if (userAccount == null) {
        throw new NotFoundError("Account number not found in User");
      }
      let [bankAccount, bankAccountIndex] = Bank.findBank(userAccount.bankId);
      this.accounts[accountIndex].addAmount(amount, accountNumber, -1);
      if (bankAccount == null) {
        throw new NotFoundError("Account not found in Bank");
      }
      bankAccount.updateBankTotal();
      this.updateNetWorth();
      return bankAccount;
    } catch (error) {
      throw error;
    }
  }

  /// User Withdraw ///
  withdraw(accountNumber, amount) {
    try {
      
      if (amount < 0) {
        throw new ValidationError("invalid Amount");
      }

      let [userAccount, accountIndex] = this.findUserAccount(accountNumber);
      if (userAccount == null) {
        throw new NotFoundError("Account number not found in User");
      }
      let [bankAccount, bankAccountIndex] = Bank.findBank(userAccount.bankId);
      this.accounts[accountIndex].deductAmount(amount, -1, accountNumber);
      if (bankAccount == null) {
        throw new NotFoundError("Account not found in Bank");
      }
      bankAccount.updateBankTotal();
      this.updateNetWorth();
      return bankAccount;
    } catch (error) {
      return error;
    }
  }

  /// User Transfer ///
  transfer(fromAccountNo, toAccountNo, transferAmount) {
    try {
      let [from, fromIndex] = this.findUserAccount(fromAccountNo);
      if (from == null) {
        throw new UnauthorizedError("Not Authorized to transfer from this Acc");
      }

      let to = Account.findAccount(toAccountNo);
      

      // if (from.userId == to.userId && from.bankId == to.bankId) {
      //   throw new UnauthorizedError("Not Allowed to transfer to self");
      // }

      if (from.AccountBalance - transferAmount < 1000) {
        throw new ValidationError("Insufficent Balance");
      }

      from.deductAmount(transferAmount, fromAccountNo, toAccountNo);
      to.addAmount(transferAmount, fromAccountNo, toAccountNo);

      let [bankTotalFrom, fromTotalIndex] = Bank.findBank(from.bankId);
      let [bankTotalTo, toTotalIndex] = Bank.findBank(to.bankId);

      bankTotalFrom.updateBankTotal();
      bankTotalTo.updateBankTotal();

      let userNetWorthToBeUpdated = User.findUser(to.userId);

      this.updateNetWorth();
      userNetWorthToBeUpdated.updateNetWorth();
      return Account.allAccounts;
    } catch (error) {
      throw error
    }
  }

  /// get Transactions by date ///
  getAccountTransactionsByDate(accountNumber, startDate, endDate) {
    try {
      
      // if (typeof startDate != "string") {
      //   throw new ValidationError("Not a Valid from start Date");
      // }
      // if (typeof endDate != "string") {
      //   throw new ValidationError("Not a Valid from end Date");
      // }

      let [userAccount, fromIndex] = this.findUserAccount(accountNumber);
      if (userAccount == "") {
        throw new UnauthorizedError(
          "Not Authorized to get transactions of this Acc"
        );
      }
      let userPassbook = userAccount.passbook;
      console.log(userPassbook  );
      if (startDate === "") {
        startDate = "1/1/1800";
      }
      if (endDate === "") {
        let temp = new Date();
        endDate = temp.toLocaleDateString();
      }

      let filteredDate = userPassbook.filter((transaction) => {
        return transaction.date >= startDate && transaction.date <= endDate;
      });

      return filteredDate;
    } catch (error) {
      throw error
    }
  }


  static findUserName(userName){
    try {
      for(let i=0;i<User.allUsers.length;i++){
        if(User.allUsers[i].userName==userName){
          return [User.allUsers[i],i]
        }
      }
      throw new NotFoundError("user not found")

    } catch (error) {
      throw error
    }
  }


  static async getAuthenticate(userName,password){
    try{
      let[user,index]=User.findUserName(userName)
     console.log(user);
      let checkPassword=await bcrypt.compare(password,user.password)
        
      if(!checkPassword){
        throw new ValidationError("invalid password")
      }
   
  
      let token=JwtAuthentication.newJwtAuthentication(user.id,user.userName,user.isAdmin)
     
      return token
    }
    catch(error){
      throw error
    }
  }
}

module.exports = User;
