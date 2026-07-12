/**
 * ==========================================================
 * UNIMENTORAI AUTH SERVICE V12
 * BUSINESS LOGIC AUTHENTICATION
 * PRODUCTION READY
 * ==========================================================
 */


import jwt from "jsonwebtoken";
import crypto from "crypto";





class AuthService {



  constructor({

    userRepository

  }) {


    if(!userRepository){


      throw new Error(
        "AuthService: userRepository required"
      );


    }


    this.userRepository =
      userRepository;


  }









  /**
   * ========================================================
   * SANITIZE USER
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

      {...user};



    delete safe.password;

    delete safe.refreshToken;


    return safe;


  }









  /**
   * ========================================================
   * REGISTER
   * ========================================================
   */


  async register(data){



    const existing =

      await this.userRepository.findByEmail(

        data.email

      );




    if(existing){


      throw this.error(

        "EMAIL_EXISTS",

        "Email already registered",

        409

      );


    }





    const User =

      await import(
        "../../models/user.model.js"
      );





    const user =

      await User.default.create(data);





    return {


      user:

        this.sanitizeUser(user),



      token:

        this.generateToken(user)


    };


  }









  /**
   * ========================================================
   * LOGIN
   * ========================================================
   */


  async login({

    email,

    password

  }){





    email =

      String(email)

      .toLowerCase()

      .trim();







    const user =

      await this.userRepository.findByEmail(

        email

      );







    if(!user){


      throw this.error(

        "INVALID_LOGIN",

        "Invalid credentials",

        401

      );


    }







    const valid =

      await user.comparePassword(

        password

      );







    if(!valid){


      throw this.error(

        "INVALID_LOGIN",

        "Invalid credentials",

        401

      );


    }







    user.lastLoginAt =

      new Date();




    await user.save();







    return {


      user:

        this.sanitizeUser(user),



      token:

        this.generateToken(user)



    };


  }









  /**
   * ========================================================
   * JWT TOKEN
   * ========================================================
   */


  generateToken(user){


    return jwt.sign(


      {


        id:

          user._id.toString(),



        email:

          user.email,



        role:

          user.role


      },


      process.env.JWT_SECRET,


      {


        expiresIn:"7d"


      }


    );


  }









  /**
   * ========================================================
   * REFRESH TOKEN
   * ========================================================
   */


  async refreshToken(token){



    return {


      refreshToken:token


    };


  }









  /**
   * ========================================================
   * LOGOUT
   * ========================================================
   */


  async logout(userId){



    const user =

      await this.userRepository.findById(

        userId

      );




    if(user){


      user.refreshToken=null;


      await user.save();


    }



    return true;


  }









  /**
   * ========================================================
   * CURRENT USER
   * ========================================================
   */


  async getCurrentUser(userId){



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



export default AuthService;