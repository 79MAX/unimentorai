export const usersController = {
  health(req,res){
    res.json({
      module: "users",
      status: "auto-generated",
      ok: true
    });
  }
};
