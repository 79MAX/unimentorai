/**
 * ==========================================================
 * UNIMENTORAI AUTH CONTROLLER V12
 * CLEAN HTTP CONTROLLER LAYER
 * PRODUCTION READY
 * ==========================================================
 */

class AuthController {


  constructor(authService) {


    if (!authService) {

      throw new Error(
        "AuthController: authService required"
      );

    }


    this.authService = authService;


    this.register =
      this.register.bind(this);

    this.login =
      this.login.bind(this);

    this.refreshToken =
      this.refreshToken.bind(this);

    this.logout =
      this.logout.bind(this);

    this.me =
      this.me.bind(this);

  }





  /**
   * ==========================================================
   * REGISTER
   * ==========================================================
   */

  async register(req,res,next){

    try {


      console.log(
        "🔥 V12 REGISTER BODY:",
        req.body
      );



      const {

        firstName,

        lastName,

        email,

        password


      } = req.body || {};





      if (
        !firstName ||
        !email ||
        !password
      ) {


        return res.status(400).json({

          success:false,

          code:"AUTH_REGISTER_FIELDS_REQUIRED",

          message:
            "firstName, email and password are required"

        });


      }





      const payload = {


        firstName:
          String(firstName).trim(),


        lastName:
          lastName
          ? String(lastName).trim()
          : "",


        email:
          String(email)
            .toLowerCase()
            .trim(),


        password:
          String(password)


      };





      console.log(
        "🔥 V12 SERVICE PAYLOAD:",
        {
          ...payload,
          password:"***"
        }
      );





      const result =

        await this.authService.register(
          payload
        );





      return res.status(201).json({

        success:true,

        message:
          "User registered successfully",

        data:result

      });




    }


    catch(error){


      next(error);


    }


  }








  /**
   * ==========================================================
   * LOGIN
   * ==========================================================
   */

  async login(req,res,next){


    try {


      const {

        email,

        password


      } = req.body || {};





      if(
        !email ||
        !password
      ){


        return res.status(400).json({

          success:false,

          code:
            "AUTH_LOGIN_FIELDS_REQUIRED",

          message:
            "Email and password are required"

        });


      }





      const result =

        await this.authService.login({

          email:
            String(email)
              .toLowerCase()
              .trim(),

          password:
            String(password)

        });





      return res.status(200).json({

        success:true,

        message:
          "Login successful",

        data:result

      });




    }


    catch(error){


      next(error);


    }


  }









  /**
   * ==========================================================
   * REFRESH TOKEN
   * ==========================================================
   */

  async refreshToken(req,res,next){


    try {


      const {

        refreshToken


      } = req.body || {};





      if(!refreshToken){


        return res.status(400).json({

          success:false,

          code:
            "AUTH_REFRESH_TOKEN_REQUIRED",

          message:
            "Refresh token required"

        });


      }





      const result =

        await this.authService.refreshToken(
          refreshToken
        );





      return res.json({

        success:true,

        data:result

      });




    }


    catch(error){


      next(error);


    }


  }









  /**
   * ==========================================================
   * LOGOUT
   * ==========================================================
   */

  async logout(req,res,next){


    try {


      const userId =
        req.user?.id;





      if(!userId){


        return res.status(401).json({

          success:false,

          code:
            "AUTH_UNAUTHORIZED",

          message:
            "Unauthorized"

        });


      }





      await this.authService.logout(
        userId
      );





      return res.json({

        success:true,

        message:
          "Logged out successfully"

      });




    }


    catch(error){


      next(error);


    }


  }









  /**
   * ==========================================================
   * CURRENT USER
   * ==========================================================
   */

  async me(req,res,next){


    try {


      const userId =
        req.user?.id;





      if(!userId){


        return res.status(401).json({

          success:false,

          code:
            "AUTH_UNAUTHORIZED",

          message:
            "Unauthorized"

        });


      }





      const user =

        await this.authService.getCurrentUser(
          userId
        );





      return res.json({

        success:true,

        data:user

      });




    }


    catch(error){


      next(error);


    }


  }



}



export default AuthController;