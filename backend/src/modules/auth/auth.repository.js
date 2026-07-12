/**
 * ==========================================================
 * UNIMENTORAI AUTH REPOSITORY V12
 * MONGOOSE DATA ACCESS LAYER
 * PRODUCTION READY
 * ==========================================================
 */


import User from "../../models/user.model.js";



class AuthRepository {



  /**
   * ========================================================
   * FIND USER BY EMAIL
   * LOGIN ONLY
   * ========================================================
   */


  async findByEmail(email) {


    if(!email){
      return null;
    }


    return await User
      .findOne({
        email:
          email.toLowerCase().trim()
      })
      .select("+password");


  }







  /**
   * ========================================================
   * FIND USER BY ID
   * PUBLIC USER DATA
   * ========================================================
   */


  async findById(id) {


    if(!id){
      return null;
    }


    return await User
      .findById(id);


  }







  /**
   * ========================================================
   * CREATE USER
   * ========================================================
   */


  async create(data) {


    return await User.create(data);


  }







  /**
   * ========================================================
   * UPDATE USER
   * ========================================================
   */


  async update(id,data){


    return await User.findByIdAndUpdate(

      id,

      data,

      {
        new:true,
        runValidators:true
      }

    );


  }







  /**
   * ========================================================
   * DELETE USER
   * ========================================================
   */


  async delete(id){


    return await User.findByIdAndDelete(id);


  }



}



export default new AuthRepository();