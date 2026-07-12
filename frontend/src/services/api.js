import axios from "axios";

/* =========================
   BASE CONFIG V12
========================= */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";


const api = axios.create({

  baseURL: API_BASE_URL,

  timeout: 8000,

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

});



/* =========================
   REQUEST INTERCEPTOR
   JWT SECURITY V12
========================= */

api.interceptors.request.use(

  (config) => {


    const token =
      localStorage.getItem("token");


    if (token) {


      config.headers =
        config.headers || {};


      config.headers.Authorization =
        `Bearer ${token}`;

    }



    if (import.meta.env.DEV) {

      console.log(
        `[API V12] ${config.method?.toUpperCase()} ${config.url}`
      );

    }



    return config;


  },


  (error)=>{

    return Promise.reject(error);

  }

);




/* =========================
   RESPONSE INTERCEPTOR
   V12 ERROR SECURITY
========================= */

api.interceptors.response.use(


  (response)=>{


    return response;


  },


  async(error)=>{


    const status =
      error?.response?.status;



    /*
      TOKEN EXPIRED
      CLEAN SESSION
    */

    if(status === 401){


      localStorage.removeItem(
        "token"
      );


      localStorage.removeItem(
        "user"
      );


    }




    const formattedError = {


      message:

        error?.response?.data?.message

        ||

        error?.message

        ||

        "API Error",



      status:

        status || 500,



      data:

        error?.response?.data

        ||

        null,



      network:

        !error.response,

    };



    if(import.meta.env.DEV){

      console.error(
        "[API V12 ERROR]",
        formattedError
      );

    }



    return Promise.reject(
      formattedError
    );


  }

);




/* =========================
   HEALTH CHECK
========================= */

export const getHealth = async()=>{


  const res =
    await api.get(
      "/api/health"
    );


  return res.data;


};





/* =========================
   AI STATUS
========================= */

export const getAIStatus = async()=>{


  const res =
    await api.get(
      "/api/ai-status"
    );


  return res.data;


};





/* =========================
   ROOT STATUS
========================= */

export const getRootStatus = async()=>{


  const res =
    await api.get(
      "/"
    );


  return res.data;


};





/* =========================
   AUTH V12
========================= */


export const loginRequest = async(
  email,
  password
)=>{


  const res =
    await api.post(

      "/api/auth/login",

      {
        email,
        password,
      }

    );


  if(res.data?.token){


    localStorage.setItem(

      "token",

      res.data.token

    );


  }



  if(res.data?.user){


    localStorage.setItem(

      "user",

      JSON.stringify(
        res.data.user
      )

    );


  }



  return res.data;


};






export const registerRequest = async(
  userData
)=>{


  const res =
    await api.post(

      "/api/auth/register",

      userData

    );


  return res.data;


};






export const getCurrentUser = async()=>{


  const res =
    await api.get(

      "/api/auth/me"

    );


  return res.data;


};






export const refreshTokenRequest = async()=>{


  const res =
    await api.post(

      "/api/auth/refresh"

    );


  return res.data;


};






export const logoutRequest = async()=>{


  try{


    await api.post(

      "/api/auth/logout"

    );


  }

  catch(error){


    console.warn(
      "[AUTH V12] logout fallback"
    );


  }



  localStorage.removeItem(
    "token"
  );


  localStorage.removeItem(
    "user"
  );


};





/* =========================
   GENERIC REQUEST
========================= */

export const apiRequest = async(

  method,

  url,

  data=null

)=>{


  const res =
    await api({

      method,

      url,

      data,

    });



  return res.data;


};





/* =========================
   EXPORT
========================= */

export default api;