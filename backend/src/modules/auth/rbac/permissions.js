/**
 * ==========================================================
 * UNIMENTORAI RBAC V12
 * PERMISSIONS REGISTRY
 * ==========================================================
 */


export const ROLES = {

  STUDENT:"student",

  MENTOR:"mentor",

  TEACHER:"teacher",

  ADMIN:"admin",

  SUPER_ADMIN:"super_admin"

};



export const PERMISSIONS = {


  student:[

    "course.read",
    "profile.read",
    "profile.update"

  ],



  mentor:[

    "course.read",
    "profile.read",
    "profile.update",
    "mentor.sessions"

  ],



  teacher:[

    "course.read",
    "course.create",
    "course.update",
    "profile.update"

  ],



  admin:[

    "*"

  ],



  super_admin:[

    "*"

  ]


};