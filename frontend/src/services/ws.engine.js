/**
 * ==========================================================
 * UNIMENTORAI FRONTEND V12
 * WEBSOCKET ENGINE
 * ==========================================================
 *
 * Backend:
 * ws://localhost:3000
 *
 * Exports:
 * - getWS()
 * - getWSState()
 * - sendWS()
 * - subscribeWS()
 *
 * ==========================================================
 */


const WS_URL =

  import.meta.env.VITE_WS_URL ||

  "ws://localhost:3000";



let ws = null;


let retry = 0;


let listeners = [];




const state = {

  status: "DISCONNECTED",

  clientId: null,

  retry: 0

};






/**
 * ==========================================================
 * CREATE WEBSOCKET
 * ==========================================================
 */


function createWS(){


  if(

    ws &&

    (

      ws.readyState === WebSocket.OPEN ||

      ws.readyState === WebSocket.CONNECTING

    )

  ){

    return ws;

  }






  ws = new WebSocket(WS_URL);





  ws.onopen = ()=>{


    state.status =
      "CONNECTED";


    state.retry =
      0;



    retry = 0;



    emit({

      type:"STATUS",

      status:"CONNECTED"

    });



    console.log(

      "🟢 WS CONNECTED"

    );


  };








  ws.onmessage = (event)=>{


    try{


      const data =

        JSON.parse(

          event.data

        );



      if(data.clientId){


        state.clientId =
          data.clientId;


      }



      emit(data);



    }

    catch(error){


      console.error(

        "WS MESSAGE ERROR",

        error

      );


    }


  };








  ws.onerror = (error)=>{


    console.error(

      "🔴 WS ERROR",

      error

    );


  };








  ws.onclose = ()=>{


    state.status =
      "DISCONNECTED";



    retry++;


    state.retry =
      retry;



    emit({

      type:"STATUS",

      status:"DISCONNECTED",

      retry

    });



    console.warn(

      "🔴 WS DISCONNECTED"

    );




    setTimeout(

      createWS,

      Math.min(

        retry * 2000,

        10000

      )

    );


  };





  return ws;

}









/**
 * ==========================================================
 * GET CONNECTION
 * ==========================================================
 */


export function getWS(){


  return createWS();


}








/**
 * ==========================================================
 * GET CURRENT STATE
 * ==========================================================
 */


export function getWSState(){


  return {

    ...state,

    readyState:

      ws

      ? ws.readyState

      : WebSocket.CLOSED

  };


}








/**
 * ==========================================================
 * SEND DATA
 * ==========================================================
 */


export function sendWS(data){


  if(

    ws &&

    ws.readyState === WebSocket.OPEN

  ){


    ws.send(

      JSON.stringify(data)

    );


  }


}








/**
 * ==========================================================
 * SUBSCRIBE EVENTS
 * ==========================================================
 */


export function subscribeWS(callback){


  listeners.push(callback);



  return ()=>{


    listeners =

      listeners.filter(

        listener =>

        listener !== callback

      );


  };


}







function emit(data){


  listeners.forEach(

    callback=>{


      callback(data);


    }

  );


}







export default {

  getWS,

  getWSState,

  sendWS,

  subscribeWS

};

/**
 * ==========================================================
 * AUTO START CONNECTION
 * ==========================================================
 */

createWS();