/**
 * ==========================================================
 * UNIMENTORAI USER REPOSITORY V12
 * DATA ACCESS LAYER
 * PRODUCTION READY
 * ==========================================================
 *
 * ROLE:
 * - Isolation MongoDB
 * - Centralisation queries User
 * - Aucun traitement métier
 * - Sécurité données sensibles
 *
 * FLOW:
 *
 * UserService
 *      ↓
 * UserRepository
 *      ↓
 * User Model
 *      ↓
 * MongoDB
 *
 * ==========================================================
 */


import User from "../../models/user.model.js";




class UserRepository {



  /**
   * ========================================================
   * FIND USER BY ID
   * ========================================================
   */


  async findById(id){


    if(!id){

      return null;

    }


    return User.findById(id)
      .select("-password")
      .exec();


  }







  /**
   * ========================================================
   * FIND USER BY EMAIL
   * ========================================================
   */


  async findByEmail(email){


    if(!email){

      return null;

    }



    return User.findOne({

      email:
        email.toLowerCase().trim()

    })
    .exec();


  }







  /**
   * ========================================================
   * FIND ALL USERS
   * ========================================================
   */


  async findAll(){


    return User.find()

      .select("-password")

      .sort({

        createdAt:-1

      })

      .exec();


  }







  /**
   * ========================================================
   * CREATE USER
   * ========================================================
   */


  async create(data){


    const user =
      await User.create(data);



    return user;


  }







  /**
   * ========================================================
   * UPDATE USER
   * ========================================================
   *
   * - Validation mongoose
   * - Recalcul fullName
   * - Retour document frais
   *
   * ========================================================
   */


  async update(
    id,
    data
  ){


    return this.updateById(
      id,
      data
    );


  }





  async updateById(
    id,
    data
  ){


    const currentUser =
      await User.findById(id);



    if(!currentUser){

      return null;

    }




    const update = {

      ...data

    };





    if(

      data.firstName !== undefined ||

      data.lastName !== undefined

    ){


      const firstName =

        data.firstName ??
        currentUser.firstName;



      const lastName =

        data.lastName ??
        currentUser.lastName;




      update.fullName =

        `${firstName} ${lastName}`

        .trim();


    }





    return User.findByIdAndUpdate(

      id,


      {

        $set:update

      },


      {

        new:true,

        runValidators:true

      }

    )

    .select("-password")

    .exec();


  }







  /**
   * ========================================================
   * SOFT DELETE USER
   * ========================================================
   */


  async deactivate(id){


    return User.findByIdAndUpdate(

      id,


      {

        $set:{

          isActive:false

        }

      },


      {

        new:true

      }

    )

    .select("-password")

    .exec();


  }







  /**
   * ========================================================
   * DELETE DEFINITIVE
   * ========================================================
   */


  async deleteById(id){


    return User.findByIdAndDelete(id)
      .exec();


  }







  /**
   * ========================================================
   * COUNT USERS
   * ========================================================
   */


  async count(){


    return User.countDocuments()
      .exec();


  }







}



export default new UserRepository();