/**
 * ==========================================================
 * UNIMENTORAI TOKEN STORE V12
 * SESSION SECURITY CORE
 * ==========================================================
 *
 * DEV:
 * In-memory Map
 *
 * FUTURE:
 * Redis Adapter
 *
 * ==========================================================
 */


import crypto from "crypto";


class TokenStore {


  constructor(){

    this.store = new Map();

  }



  _key(userId){

    return `auth:${userId}`;

  }



  async save(
    userId,
    {
      refreshToken,
      sessionId,
      ttlDays = 7
    }
  ){


    const key =
      this._key(userId);



    const now =
      Date.now();



    this.store.set(
      key,
      {

        userId,

        refreshToken,

        sessionId:
          sessionId ||
          crypto.randomUUID(),


        createdAt:
          now,


        expiresAt:
          now +
          ttlDays *
          24 *
          60 *
          60 *
          1000

      }
    );


    return true;

  }




  async get(userId){


    const session =
      this.store.get(
        this._key(userId)
      );


    if(!session){

      return null;

    }



    if(
      Date.now() >
      session.expiresAt
    ){

      this.store.delete(
        this._key(userId)
      );


      return null;

    }


    return session;

  }




  async delete(userId){

    return this.store.delete(
      this._key(userId)
    );

  }




  async validate(
    userId,
    refreshToken
  ){


    const session =
      await this.get(userId);



    return Boolean(
      session &&
      session.refreshToken === refreshToken
    );

  }




  async rotate(
    userId,
    {
      refreshToken,
      sessionId
    }
  ){


    const session =
      await this.get(userId);



    if(!session){

      return false;

    }



    this.store.set(
      this._key(userId),
      {

        ...session,

        refreshToken,

        sessionId:
          sessionId ||
          crypto.randomUUID(),

        updatedAt:
          Date.now()

      }
    );


    return true;

  }




  async list(){

    return [
      ...this.store.values()
    ];

  }




  async clear(){

    this.store.clear();

  }


}


export default TokenStore;