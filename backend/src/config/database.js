/**
 * ==========================================================
 * UNIMENTORAI DATABASE CONFIG V12
 * MONGODB CONNECTION MANAGER
 * PRODUCTION READY
 * ==========================================================
 */


import mongoose from "mongoose";


let connectionPromise = null;



/**
 * ==========================================================
 * CONNECT DATABASE
 * ==========================================================
 */

export default async function connectDatabase() {


  if (mongoose.connection.readyState === 1) {

    console.log(
      "🟢 MongoDB already connected"
    );

    return mongoose.connection;

  }



  if (connectionPromise) {

    return connectionPromise;

  }



  const mongoURI =
    process.env.MONGO_URI;



  if (!mongoURI) {

    throw new Error(
      "DATABASE ERROR: MONGO_URI missing"
    );

  }



  connectionPromise =
    mongoose.connect(

      mongoURI,

      {


        serverSelectionTimeoutMS:15000,


        connectTimeoutMS:15000,


        socketTimeoutMS:45000,


        maxPoolSize:20,


        minPoolSize:2,


        family:4,


        retryWrites:true,


        w:"majority"


      }


    );




  try {


    await connectionPromise;



    console.log(
      "🟢 MongoDB CONNECTED:",
      mongoose.connection.host
    );



    return mongoose.connection;



  }

  catch(error){


    connectionPromise = null;


    console.error(
      "🔴 MongoDB CONNECTION FAILED:",
      error.message
    );


    throw error;


  }


}
