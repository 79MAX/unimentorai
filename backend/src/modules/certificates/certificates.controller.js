export const certificatesController = {
  health(req,res){
    res.json({ ok:true, module:'certificates' });
  }
};
