const Kyc=require("../../models/kyc");
const Promoter=require("../../models/promoters");
const Incentives=require('../../models/promoter_incentives');
const Notifications=require("../../models/notification");
const TargetsAndBonuses=require("../../models/targetsAndBonus");

const promoterRegistration=require("../../controllers/promoters/logins")


exports.getAllPendingKyc=async (req,res)=>{
   try{
     const kycVideos=await Kyc.find({
           status:"pending"
     })
     console.log(kycVideos)
     if (kycVideos) {
        res.status(200).json({ 
            message: " details  has been fetched",
            data: kycVideos
    
    });
      } else {
        res.status(400).json({ message: "Bad request" });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message || "Bad request" });
    }
}


exports.approveKyc =async (req,res)=>{
    const kycId=req.body.kycId
    try{
       const kycDetails=await Kyc.findOneAndUpdate({
        _id:new mongoose.Types.ObjectId(kycId)
       },{
          status:"approved"
       },{new:true})
       if (kycDetails) {
        res.status(200).json({ 
            message: "kyc has been approved",
            data: kycDetails
    
    });
      } else {
        res.status(400).json({ message: "Bad request" });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message || "Bad request" });
    }
}

exports.approveKycByPromoterId =async (req,res)=>{
    const kycId=req.body.kycId
    const promoterId=req.body.promoterId;
    const istDateTime = DateTime.now().setZone("Asia/Kolkata");
      console.log(istDateTime)      
      const logDate = istDateTime.toISO({ includeOffset: true });
      const time = istDateTime.toFormat("hh:mm a");
    try{
       const kycDetails=await Kyc.findOneAndUpdate({
        promoterId:new mongoose.Types.ObjectId(promoterId)
       },{
          status:"approved"
       },{new:true})
        
       const promoter=await Promoter.findOneAndUpdate({
        _id:new mongoose.Types.ObjectId(promoterId)
       },{
          kycVerified:true,
          kycStatus:"approved"
       },{new:true})
   // console.log(promoter)
       const added_incentives=await Incentives.create({
        promoterId:promoterId,
        promoterName:promoter.name,
        pendingIncentives:0,
        earnedIncentives:0,
        acheivedTargets:0,
        pendingTargets:0,
        totaltargets:req.body.totalTargets,
        monthTarget:req.body.monthTarget
      });
      
      const queries=await TargetsAndBonuses.create({
        promoterId:promoterId,
        month:istDateTime.month,
        year:istDateTime.year,
        logCreatedDate:logDate,
        logModifiedDate:logDate
      }
       // monthTarget:parseInt(req.body.monthTarget),
       
      );
        

      
      let usersArr=[];
     let usersIdsArr=[];
      
       // const users = await Promoter.find(query, { fcmToken: 1, _id: 1 });
      //  console.log(users,"kk")
        const usersArray = promoter.fcmToken;
        const usersIds =  promoter._id;
        usersArr.push(usersArray);
        usersIdsArr.push(usersIds);

         // const flattenedUsersArr = usersArr.flat().filter(Boolean);
    // const flattenedUsersIdsArr = usersIdsArr.flat().filter(Boolean);
    // console.log("flattenedUsersArr", flattenedUsersArr);
   // console.log("flattenedUsersIdsArr", flattenedUsersIdsArr);
    const message = {
      registration_ids: usersArr,
      notification: {
        title: "KYC Approval",
        body: "your Kyc has been approved",
      },
    };
    fcm.send(message, function (err, response) {
      if (err) {
        console.log("Failed to send notification:", err);
      } else {
        console.log("Successfully sent notification with response:", response);
      }
    });

    const savenotification = await Notifications.create({
      date: logDate.slice(0, 10),
      time,
      title: "KYC Approval",
      description: "your Kyc has been approved",
      type: "Admin",
      image: req.file ? req.file.path : console.log("no notification image"),
      sendTo: req.body.sendTo,
      users: usersIdsArr,
      notificationType: req.body.notificationType
        ? (req.body.notificationType)
        : null,
      logCreatedDate: logDate,
      logModifiedDate: logDate,
    });


      console.log(added_incentives,"incet added")
    
       if (promoter) {

        await promoterRegistration.promoterRegistrastion(req,res,promoterId)
    //     res.status(200).json({ 
    //         message: "kyc has been approved",
    //         data: kycDetails
    
    // });
      } else {
        res.status(400).json({ message: "Bad request" });
      }
      
    }
   
     catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message || "Bad request" });
    }
}

exports.rejectKyc= async (req,res)=>{
    const kycId=req.body.KycId;
    const promoterId=req.body.promoterId;
    const reason=req.body.reason;
    console.log((promoterId));
    
    const istDateTime = DateTime.now().setZone("Asia/Kolkata");
      console.log(istDateTime)      
      const logDate = istDateTime.toISO({ includeOffset: true });
      const time = istDateTime.toFormat("hh:mm a");

    try{
        const kycDetails=await Kyc.findOneAndUpdate({
            promoterId:new mongoose.Types.ObjectId(promoterId)
        },{
           status:"rejected",
           rejection:reason
        },{new:true})

        const promoter=await Promoter.findOneAndUpdate({
          _id:new mongoose.Types.ObjectId(promoterId)
      },{
         kycStatus:"rejected",
         rejectionReason:reason
      },{new:true})
        if (promoter) {
          let usersArr=[];
     let usersIdsArr=[];
      
       // const users = await Promoter.find(query, { fcmToken: 1, _id: 1 });
      //  console.log(users,"kk")
        const usersArray = promoter.fcmToken;
        const usersIds =  promoter._id;
        usersArr.push(usersArray);
        usersIdsArr.push(usersIds);

          const message = {
            registration_ids: usersArr,
            notification: {
              title: "KYC Rejected",
              body: "your Kyc has been rejected",
            },
          };
          fcm.send(message, function (err, response) {
            if (err) {
              console.log("Failed to send notification:", err);
            } else {
              console.log("Successfully sent notification with response:", response);
            }
          });
      
          const savenotification = await Notifications.create({
            date: logDate.slice(0, 10),
            time,
            title: "KYC Rejected",
            description: "your Kyc has been rejected",
            type: "Admin",
            image: req.file ? req.file.path : console.log("no notification image"),
            sendTo: req.body.sendTo,
            users: usersIdsArr,
            notificationType: req.body.notificationType
              ? (req.body.notificationType)
              : null,
            logCreatedDate: logDate,
            logModifiedDate: logDate,
          });


         res.status(200).json({ 
             message: "kyc has been rejected",
             data: kycDetails,
             promoter
     
     });
       } else {
         res.status(400).json({ message: "Bad request" });
       }
     } catch (err) {
       console.log(err);
       res.status(400).json({ message: err.message || "Bad request" });
     }

}

exports.getAllKyc_reverification_requests= async (req,res)=>{
  try{
    const kycVideos=await Promoter.find({
      kycReverificationStatus:"requested"
    })
    console.log(kycVideos)
    if (kycVideos) {
       res.status(200).json({ 
           message: " details  has been fetched",
           data: kycVideos
   
   });
     } else {
       res.status(400).json({
        data:kycVideos,
        message: "Bad request" 
        });
     }
   } catch (err) {
     console.log(err);
     res.status(400).json({ message: err.message || "Bad request" });
   }
}


exports.approve_kyc_reverification_req= async (req,res)=>{
  const promoterId=req.body.promoterId;
  try{
    const kycVideos=await Promoter.findOneAndUpdate(
      {
         _id: promoterId
      },
      
      {
      kycReverificationStatus:"approved",
      kycStatus:"pending"
    })
    console.log(kycVideos)
    if (kycVideos) {
       res.status(200).json({ 
           message: " details  has been fetched",
           data: kycVideos
   
   });
     } else {
       res.status(400).json({
        data:kycVideos,
        message: "Bad request" 
        });
     }
   } catch (err) {
     console.log(err);
     res.status(400).json({ message: err.message || "Bad request" });
   }
}