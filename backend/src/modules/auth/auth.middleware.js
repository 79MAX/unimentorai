/**
 * ==========================================================
 * UNIMENTORAI AUTH MIDDLEWARE V12
 * JWT VALIDATION LAYER
 * PRODUCTION READY
 * ==========================================================
 *
 * FLOW:
 *
 * Request
 *    ↓
 * Authorization Header
 *    ↓
 * JWT Verify
 *    ↓
 * req.user
 *    ↓
 * Controller
 *
 * ==========================================================
 */


import jwt from "jsonwebtoken";





/**
 * ==========================================================
 * JWT SECRET VALIDATION
 * ==========================================================
 */


function getJwtSecret(){


  const secret =

    process.env.JWT_SECRET;



  if(!secret){


    throw new Error(
      "JWT_SECRET missing"
    );


  }



  return secret;


}









/**
 * ==========================================================
 * AUTH MIDDLEWARE
 * ==========================================================
 */


export function authMiddleware(

  req,

  res,

  next

){


  try{



    const header =

      req.headers.authorization;





    if(!header){


      return res.status(401).json({

        success:false,

        message:
          "Authorization token required",

        code:
          "AUTH_TOKEN_MISSING"

      });


    }







    const parts =

      header.split(" ");





    if(

      parts.length !== 2 ||

      parts[0] !== "Bearer"

    ){



      return res.status(401).json({

        success:false,

        message:
          "Expected Bearer token",

        code:
          "AUTH_TOKEN_FORMAT_INVALID"

      });



    }







    const token = parts[1];






    if(!token){


      return res.status(401).json({

        success:false,

        message:
          "Token missing",

        code:
          "AUTH_TOKEN_MISSING"

      });


    }









    const payload =

      jwt.verify(

        token,

        getJwtSecret()

      );








    if(!payload.id){



      return res.status(401).json({

        success:false,

        message:
          "Invalid token payload",

        code:
          "AUTH_TOKEN_PAYLOAD_INVALID"

      });



    }







    req.user = {


      id:

        payload.id,


      email:

        payload.email || null,


      role:

        payload.role || "student"


    };







    next();





  }

  catch(error){



    if(

      error.name === "TokenExpiredError"

    ){


      return res.status(401).json({

        success:false,

        message:
          "Token expired",

        code:
          "AUTH_TOKEN_EXPIRED"

      });


    }






    if(

      error.name === "JsonWebTokenError"

    ){


      return res.status(401).json({

        success:false,

        message:
          "Invalid token",

        code:
          "AUTH_TOKEN_INVALID"

      });


    }






    next(error);



  }



}