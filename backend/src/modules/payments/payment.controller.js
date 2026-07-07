export const paymentsController = {
  health(req,res){
    res.json({
      module: "payments",
      status: "auto-generated",
      ok: true
    });
  }
};
