const Banner=require("../../models/banners");
const { DateTime } = require("luxon");

exports.updateBanner= async (req,res)=>{
    const title=req.body.title;
    const description=req.body.description;
    const bannerId=req.body.bannerId;

    const istDateTime = DateTime.now().setZone("Asia/Kolkata");
    const logDate = istDateTime.toISO({ includeOffset: true });
    console.log(req.file)


    try{
        if(bannerId){
            const updated_banner=await Banner.findOneAndUpdate(  
                {_id: bannerId},{
                  title: title?title:console.log("no tTitle"),
                  description:description ? description:console.log("nnoo dessc"),
                  image:req.file? req.file.path:console.log("no image update"),
                  logModifiedDate:logDate
                },{new: true})
  
                if(updated_banner){
                  res.status(200).json({
                    data:updated_banner,
                    message: "Your banner has been updated successfully",
                  });
                }else{
                  res.status(400).json({
  
                    message: "please update again",
                  });
                }
              
            
      }else{
        const added_banner=await Banner.create({
            title: title,
            description: description,
            image:req.file? req.file.path:console.log("no image update"),
            logCreatedDate:logDate})
        if(added_banner){
          res.status(200).json({
            data:added_banner,
            message: "Your banner has been updated successfully",
          });
        }
        else{
          res.status(400).json({
  
            message: "please create again",
          });
        }
      }
    }
    catch(err){

        console.log((err))
        res.status(400).json({
  
            message: "please create again",
          });
    }
}

exports.getBanners= async (req,res)=>{
    try {
        const istDateTime = DateTime.now().setZone("Asia/Kolkata");
        const logDate = istDateTime.toISO({ includeOffset: true });
    
        const banners = await Banner.find({});
    
        if (!banners) {
            return res.status(200).json({
              message: "Successful but no banners",
              banners: banners ?? {},
            });
          //}
        } else {
          return res.status(200).json({
            message: "Successfull ",
            banners: banners ?? {},
          });
        }
      } catch (err) {
        console.log(err);
        return res.status(400).json({ message: err.message ?? "Bad request" });
      }
    };
  
exports.deleteBanner= async (req,res)=>{
    const bannerId=req.body.bannerId;
    try {
        const istDateTime = DateTime.now().setZone("Asia/Kolkata");
        const logDate = istDateTime.toISO({ includeOffset: true });
    
       // const brands = await Brand.find({});
       const deleted_product=await Banner.deleteMany({ _id: { $in: bannerId } })
    
        if (deleted_product.deletedCount<1) {
            return res.status(200).json({
              message: "please try again",
              deleted_banner: deleted_product ?? {},
            });
          //}
        } else {
          return res.status(200).json({
            message: "Successfull ",
            deleted_banner: deleted_product ?? {},
          });
        }
      } catch (err) {
        console.log(err);
        return res.status(400).json({ message: err.message ?? "Bad request" });
      }
  }


//    /