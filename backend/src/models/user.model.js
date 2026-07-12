/**
 * ==========================================================
 * UNIMENTORAI USER MODEL V12
 * MONGOOSE USER ENTITY
 * PRODUCTION READY
 * ==========================================================
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";


console.log("✅ V12 USER MODEL LOADED");



const userSchema = new mongoose.Schema(

{


  // ======================================================
  // IDENTITY
  // ======================================================


  firstName: {

    type:String,

    trim:true,

    maxlength:100,

    required:true

  },


  lastName: {

    type:String,

    trim:true,

    maxlength:100,

    default:""

  },


  fullName: {

    type:String,

    trim:true,

    default:""

  },


  email: {

    type:String,

    required:true,

    unique:true,

    lowercase:true,

    trim:true

  },


  password: {

    type:String,

    required:true,

    minlength:8,

    select:false

  },


  avatar: {

    type:String,

    default:null

  },


  phone: {

    type:String,

    default:null

  },


  country: {

    type:String,

    default:"Benin"

  },


  language: {

    type:String,

    default:"fr"

  },





  // ======================================================
  // SECURITY
  // ======================================================


  role: {

    type:String,

    enum:[

      "student",
      "mentor",
      "teacher",
      "admin",
      "super_admin"

    ],

    default:"student"

  },


  isVerified: {

    type:Boolean,

    default:false

  },


  isActive: {

    type:Boolean,

    default:true

  },


  refreshToken: {

    type:String,

    default:null,

    select:false

  },


  lastLoginAt: {

    type:Date,

    default:null

  },


  loginAttempts: {

    type:Number,

    default:0

  },


  lockUntil: {

    type:Date,

    default:null

  },







  // ======================================================
  // LEARNING
  // ======================================================


  enrolledCourses:[

    {

      type:mongoose.Schema.Types.ObjectId,

      ref:"Course"

    }

  ],


  completedCourses:[

    {

      type:mongoose.Schema.Types.ObjectId,

      ref:"Course"

    }

  ],


  certificates:[

    {

      type:mongoose.Schema.Types.ObjectId,

      ref:"Certificate"

    }

  ],







  // ======================================================
  // MENTOR PROFILE
  // ======================================================


  mentorProfile:{


    enabled:{

      type:Boolean,

      default:false

    },


    expertise:[

      String

    ],


    rating:{

      type:Number,

      default:0

    },


    sessionsCount:{

      type:Number,

      default:0

    }


  },









  // ======================================================
  // SUBSCRIPTION
  // ======================================================


  subscription:{


    plan:{


      type:String,


      enum:[

        "free",
        "premium",
        "enterprise"

      ],


      default:"free"


    },


    expiresAt:{


      type:Date,


      default:null


    }


  },









  // ======================================================
  // AI PROFILE
  // ======================================================


  aiProfile:{


    level:{


      type:String,


      enum:[

        "beginner",
        "intermediate",
        "advanced"

      ],


      default:"beginner"


    },


    learningScore:{


      type:Number,


      default:0


    }


  }



},


{


  timestamps:true,


  versionKey:false


}


);









// ======================================================
// AUTO FULL NAME ON CREATE / SAVE
// ======================================================


userSchema.pre(

  "save",

  function(next){


    this.fullName =

      `${this.firstName || ""} ${this.lastName || ""}`

      .trim();



    next();


  }

);









// ======================================================
// AUTO FULL NAME ON UPDATE
// ======================================================


userSchema.pre(

  "findOneAndUpdate",

  function(next){


    const update =

      this.getUpdate();



    if(update){


      const firstName =

        update.firstName;



      const lastName =

        update.lastName;



      if(
        firstName !== undefined ||
        lastName !== undefined
      ){


        update.fullName =

          `${firstName || ""} ${lastName || ""}`

          .trim();



        this.setUpdate(update);


      }


    }



    next();


  }

);









// ======================================================
// PASSWORD HASH
// ======================================================


userSchema.pre(

  "save",

  async function(next){


    try{


      if(
        !this.isModified("password")
      ){

        return next();

      }



      const salt =

        await bcrypt.genSalt(12);



      this.password =

        await bcrypt.hash(

          this.password,

          salt

        );



      next();


    }

    catch(error){

      next(error);

    }


  }

);









// ======================================================
// PASSWORD VERIFY
// ======================================================


userSchema.methods.comparePassword =

async function(password){


  return bcrypt.compare(

    password,

    this.password

  );


};









// ======================================================
// ACCOUNT LOCK
// ======================================================


userSchema.methods.isLocked =

function(){


  return Boolean(

    this.lockUntil &&

    this.lockUntil > Date.now()

  );


};









// ======================================================
// INDEXES
// ======================================================


userSchema.index({

  role:1

});


userSchema.index({

  createdAt:-1

});









// ======================================================
// EXPORT MODEL
// ======================================================


const User =


mongoose.models.User ||


mongoose.model(

  "User",

  userSchema

);



export default User;