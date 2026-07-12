/**
 * ==========================================================
 * UNIMENTORAI USER SERVICE V12
 * BUSINESS LOGIC LAYER
 * PRODUCTION READY
 * ==========================================================
 *
 * FLOW:
 *
 * Controller
 *      ↓
 * UserService
 *      ↓
 * UserRepository
 *      ↓
 * MongoDB
 *
 * RESPONSIBILITY:
 * - Business rules
 * - User validation
 * - Security filtering
 * - Data transformation
 *
 * ==========================================================
 */


class UserService {



  constructor({
    userRepository
  }) {


    if(!userRepository){

      throw new Error(
        "UserService: userRepository required"
      );

    }


    this.userRepository =
      userRepository;


  }








  /**
   * ========================================================
   * CURRENT USER PROFILE
   * ========================================================
   */


  async getCurrentUser(userId){


    if(!userId){

      throw this.error(
        "USER_ID_REQUIRED",
        "User id required",
        400
      );

    }



    const user =

      await this.userRepository.findById(
        userId
      );



    if(!user){

      throw this.error(
        "USER_NOT_FOUND",
        "User not found",
        404
      );

    }



    return this.sanitizeUser(user);


  }









  /**
   * ========================================================
   * UPDATE PROFILE
   * ========================================================
   */


  async updateProfile(
    userId,
    data={}
  ){


    if(!userId){

      throw this.error(
        "USER_ID_REQUIRED",
        "User id required",
        400
      );

    }



    const allowedFields = [

      "firstName",
      "lastName",
      "avatar",
      "phone",
      "country",
      "language"

    ];




    const cleanData = {};



    allowedFields.forEach(
      field => {


        if(data[field] !== undefined){

          cleanData[field] =
            data[field];

        }


      }
    );





    const user =

      await this.userRepository.updateById(

        userId,

        cleanData

      );





    if(!user){

      throw this.error(
        "USER_UPDATE_FAILED",
        "Unable to update user",
        400
      );

    }





    return this.sanitizeUser(user);


  }









  /**
   * ========================================================
   * SECURITY STATUS
   * ========================================================
   */


  async getSecurityStatus(){


    return {

      status:"active",

      monitoring:true

    };


  }









  /**
   * ========================================================
   * LIST USERS
   * ========================================================
   */


  async listUsers(){


    const users =

      await this.userRepository.findAll();




    return users.map(

      user =>
        this.sanitizeUser(user)

    );


  }









  /**
   * ========================================================
   * GET USER BY ID
   * ========================================================
   */


  async getUserById(id){


    const user =

      await this.userRepository.findById(
        id
      );




    if(!user){

      throw this.error(
        "USER_NOT_FOUND",
        "User not found",
        404
      );

    }




    return this.sanitizeUser(user);


  }









  /**
   * ========================================================
   * DELETE / DEACTIVATE USER
   * ========================================================
   */


  async deactivateUser(id){


    const user =

      await this.userRepository.deactivate(
        id
      );



    if(!user){

      throw this.error(
        "USER_DELETE_FAILED",
        "Unable to deactivate user",
        400
      );

    }



    return this.sanitizeUser(user);


  }









  /**
   * ========================================================
   * COUNT USERS
   * ========================================================
   */


  async countUsers(){


    return this.userRepository.count();


  }









  /**
   * ========================================================
   * REMOVE PRIVATE DATA
   * ========================================================
   */


  sanitizeUser(user){


    if(!user){

      return null;

    }




    const safe =

      user.toObject

      ?

      user.toObject()

      :

      {
        ...user
      };





    delete safe.password;

    delete safe.refreshToken;

    delete safe.__v;




    return safe;


  }









  /**
   * ========================================================
   * ERROR FACTORY
   * ========================================================
   */


  error(
    code,
    message,
    status=500
  ){


    const error =

      new Error(message);



    error.code =
      code;



    error.status =
      status;



    return error;


  }



}





export default UserService;