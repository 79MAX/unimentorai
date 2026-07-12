/**
 * ==========================================================
 * UNIMENTORAI BACKEND V12.1
 * HELMET SECURITY CONFIGURATION
 * ==========================================================
 *
 * SECURITY LAYER:
 *
 * Express
 *    ↓
 * Helmet Middleware
 *    ↓
 * HTTP Security Headers
 *
 * ==========================================================
 */


import helmet from "helmet";


/**
 * ==========================================================
 * HELMET CONFIG
 * ==========================================================
 */

export default function helmetConfig(){


  return helmet({

    /**
     * Content Security Policy
     */

    contentSecurityPolicy:false,


    /**
     * Prevent MIME sniffing
     */

    noSniff:true,


    /**
     * Hide Express fingerprint
     */

    hidePoweredBy:true,


    /**
     * Prevent clickjacking
     */

    frameguard:{
      action:"deny"
    },


    /**
     * Referrer policy
     */

    referrerPolicy:{
      policy:"strict-origin-when-cross-origin"
    }


  });


}