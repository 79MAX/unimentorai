/**
 * ==========================================================
 * UNIMENTORAI FRONTEND V12
 * WEBSOCKET DASHBOARD
 * ==========================================================
 *
 * FLOW:
 *
 * App.jsx
 *    ↓
 * ws.engine.js
 *    ↓
 * WebSocket Gateway V12
 *    ↓
 * Backend localhost:3000
 *
 * ==========================================================
 */


import {
  useEffect,
  useState
} from "react";


import {
  getWS,
  getWSState,
  subscribeWS
}
from "./services/ws.engine.js";







export default function App(){


  const [state,setState] = useState(
    getWSState()
  );


  const [metrics,setMetrics] = useState(null);






  useEffect(()=>{


    /**
     * ======================================================
     * START WEBSOCKET
     * ======================================================
     */


    getWS();







    /**
     * ======================================================
     * RECEIVE WS EVENTS
     * ======================================================
     */


    const unsubscribe = subscribeWS(

      (message)=>{


        console.log(
          "📩 WS EVENT:",
          message
        );






        /**
         * WELCOME / STATUS
         */


        if(

          message?.type === "WELCOME" ||

          message?.type === "STATUS"

        ){

          setState(
            getWSState()
          );

        }








        /**
         * LIVE METRICS
         *
         * Backend V12 sends:
         *
         * {
         *   type:"METRIC",
         *   data:{}
         * }
         *
         */


        if(

          message?.type === "METRIC" ||

          message?.type === "METRICS"

        ){


          setMetrics(

            message.data ?? message

          );


        }



      }

    );








    /**
     * ======================================================
     * STATE LOOP
     * ======================================================
     */


    const interval = setInterval(()=>{


      setState(
        getWSState()
      );


    },1000);








    return ()=>{


      if(

        typeof unsubscribe === "function"

      ){

        unsubscribe();

      }



      clearInterval(interval);


    };



  },[]);









  return (

    <main style={styles.container}>


      <h1>

        🚀 UniMentorAI WS Dashboard

      </h1>







      <section style={styles.card}>


        <h2>

          Connection

        </h2>






        <p>

          Status:

          {" "}

          {

            state.connected ||

            state.status === "CONNECTED"

            ?

            "🟢 CONNECTED"

            :

            "🔴 DISCONNECTED"

          }


        </p>







        <p>

          Client ID:

          {" "}

          {

            state.clientId ||

            "..."

          }


        </p>







        <p>

          Retry:

          {" "}

          {

            state.retry ?? 0

          }


        </p>





      </section>









      <section style={styles.card}>


        <h2>

          Live Metrics

        </h2>







        {

          metrics

          ?

          (

            <pre style={styles.metrics}>

              {

                JSON.stringify(

                  metrics,

                  null,

                  2

                )

              }

            </pre>

          )


          :


          (

            <p>

              Waiting metrics...

            </p>

          )


        }





      </section>









    </main>

  );


}









const styles = {


  container:{


    minHeight:"100vh",


    padding:"24px",


    background:"#0b0f19",


    color:"#ffffff",


    fontFamily:"system-ui, sans-serif",


  },







  card:{


    background:"#111827",


    padding:"18px",


    marginTop:"15px",


    borderRadius:"12px",


    boxShadow:

      "0 10px 30px rgba(0,0,0,.25)",


  },








  metrics:{


    margin:0,


    whiteSpace:"pre-wrap",


    color:"#22c55e",


    fontSize:"14px",


  },


};