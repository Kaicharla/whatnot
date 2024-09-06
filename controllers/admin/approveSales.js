const Sales=require("../../models/sales");
const Incentive=require("../../models/promoter_incentives");
const Promoter=require("../../models/promoters");
const WalletRequest=require('../../models/walletRequest'); 
const Notifications=require("../../models/notification");
const TargetsAndBonuses=require("../../models/targetsAndBonus");


exports.getAllpendingSales=async (req,res)=>{
   try{
    const pendingSales=await Sales.find({
        status:"pending"
    },
    ).sort({saleDate:1})
    console.log(pendingSales)
     if (pendingSales) {
        res.status(200).json({ 
            message: " details  has been fetched",
            data: pendingSales
    
    });
      } else {
        res.status(400).json({ message: "Bad request" });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message || "Bad request" });
    }
}


exports.getAllSales2=async (req,res)=>{
  const month=req.body.month;
  const year=req.body.year;
  let date = DateTime.local();
  let condition={};
  if(month){
    date=DateTime.fromObject({ year:DateTime.now().year, month, day: 1 });
    if(year){
     date=DateTime.fromObject({ year, month, day: 1 });
     condition.logCreatedDate={ 
      $gte: date.startOf('month').toISO({ includeOffset: true }),
      $lte: date.endOf('month').toISO({ includeOffset: true })
  }

    }
 }
    try{
    
     const sales=await Sales.find(condition).sort({saleDate:1})

 
    console.log(date)
      if (sales) {
         res.status(200).json({ 
             message: " details  has been fetched",
             count:sales.length,
             data: sales,
             
     });
       } else {
         res.status(400).json({ message: "Bad request" });
       }
     } catch (err) {
       console.log(err);
       res.status(400).json({ message: err.message || "Bad request" });
     }
    }



 exports.getAllSales=async (req,res)=>{

      let condition={
        status:"approved"
      };
      const searchQuery=req.query.searchQuery;
      const regex=new RegExp(searchQuery,"i");
      if (req.query.searchQuery !== "") {
        condition = {
          $or: [{"promoter.name":regex  },{"promoter.storeName":regex  },{"promoter.email":regex},{brandName:regex},{categoryName:regex},
        {productName:regex},{price:regex},{"promoter.phone":regex},{"promoter.storeName":regex},{price:regex},{incentive:regex},
          {serialNumber:regex},
        ],
        };
      }
      const month=req.body.month;
      const year=req.body.year;
      let date = DateTime.local();
     
     
        try{
        
         const sales=await Sales.aggregate([

          {
            $sort:
            {
              logCreatedDate:-1
            }
          },
          
          {
            $lookup:{
              from: "promoters",
              localField: "promoterId",
              foreignField: "_id",
              as: "promoter"
            }
         },
         {
          $unwind:"$promoter"
         },
         {
          $lookup:{
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product"
          }
       },
       {
        $unwind:"$product"
       },
         {
          $lookup: {
            from: "brands",
              localField: "brandId",
              foreignField: "_id",
              as: "brand"
          }
        },
        {
          $unwind: "$brand" // Since $lookup returns an array, we unwind to destructure it
        },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $unwind: "$category" // Again, we unwind to destructure the product array
        },
        {
          $addFields: {
            brandName: "$brand.name",
            categoryName: "$category.name",
            productName:"$product.name"
            
          }},
         
        {
          $project: {
           
            "brand": 0,
            "category": 0,
            
          }
        },

         {
          $match:condition
        },
        ])

    
     
       // console.log(date)
          if (sales) {
             res.status(200).json({ 
                 message: " details  has been fetched",
                 count:sales.length,
                 data: sales,
                 
         });
           } else {
             res.status(400).json({ message: "Bad request" });
           }
         } catch (err) {
           console.log(err);
           res.status(400).json({ message: err.message || "Bad request" });
         }
        }

exports.getPromoterSales=  async (req,res)=>{
const  promoterId=req.body.promoterId;
try{
    const sales=await Sales.find({
      promoterId:promoterId  
    },
    ).sort({saleDate:1})
    console.log(sales)
     if (sales) {
        res.status(200).json({ 
            message: " details  has been fetched",
            data: sales
    
    });
      } else {
        res.status(400).json({ message: "Bad request" });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message || "Bad request" });
    }
   }

exports.getSingleSale=async (req,res)=>{
   const saleId=req.body.saleId;
  try{
        
    const sales=await Sales.aggregate([{
$match:{
   _id:new mongoose.Types.ObjectId(saleId)
}
    },
     {
       $lookup:{
         from: "promoters",
         localField: "promoterId",
         foreignField: "_id",
         as: "promoter"
       }
    },
    {
     $unwind:"$promoter"
    },
    {
      $lookup:{
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product"
      }
   },
   {
    $unwind:"$product"
   },
   {
    $lookup: {
      from: "brands",
        localField: "brandId",
        foreignField: "_id",
        as: "brand"
    }
  },
  {
    $unwind: "$brand" // Since $lookup returns an array, we unwind to destructure it
  },
  {
    $lookup: {
      from: "categories",
      localField: "categoryId",
      foreignField: "_id",
      as: "category"
    }
  },
  {
    $unwind: "$category" // Again, we unwind to destructure the product array
  },
  {
    $addFields: {
      brandName: "$brand.name",
      categoryName: "$category.name",
      productName:"$product.name"
      
    }},
   
  {
    $project: {
     
      "brand": 0,
      "category": 0,
      
    }
  }
   ])


   
     if (sales) {
        res.status(200).json({ 
            message: " details  has been fetched",
            count:sales.length,
            data: sales,
            
    });
      } else {
        res.status(400).json({ message: "Bad request" });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message || "Bad request" });
    }

}


  //  exports.getPromoterSales=  async (req,res)=>{
  //   const  promoterId=req.body.promoterId;
  //   try{
  //       const sales=await Sales.find({
  //         promoterId:promoterId  
  //       },
  //       ).sort({saleDate:1})
  //       console.log(sales)
  //        if (sales) {
  //           res.status(200).json({ 
  //               message: " details  has been fetched",
  //               data: sales
        
  //       });
  //         } else {
  //           res.status(400).json({ message: "Bad request" });
  //         }
  //       } catch (err) {
  //         console.log(err);
  //         res.status(400).json({ message: err.message || "Bad request" });
  //       }
  //      }
       
   exports.getPromoterPendingSales=  async (req,res)=>{
        const  promoterId=req.body.promoterId;
        try{
            const sales=await Sales.find({
              promoterId:promoterId  ,
              status:"pending"
            },
            ).sort({saleDate:1})
            console.log(sales)
             if (sales) {
                res.status(200).json({ 
                    message: " details  has been fetched",
                    data: sales
            
            });
              } else {
                res.status(400).json({ message: "Bad request" });
              }
            } catch (err) {
              console.log(err);
              res.status(400).json({ message: err.message || "Bad request" });
            }
           }

   exports.getApproveSales=  async (req,res)=>{
    const  promoterId=req.body.promoterId;
    const saleId=req.body.saleId;
    const istDateTime = DateTime.now().setZone("Asia/Kolkata");
    const logDate = istDateTime.toISO({ includeOffset: true });
    const time = istDateTime.toFormat("hh:mm a");
    try{
        const sales=await Sales.findOneAndUpdate({
            _id: new  mongoose.Types.ObjectId(saleId)
        
         // promoterId:promoterId  
        },{
            status:"approved",
            reason:""
        },
       {new: true} ).sort({saleDate:1})
    console.log(sales)

        const  updateIncentive=await Incentive.findOneAndUpdate(
            {
            
               promoterId:sales.promoterId,
            
        },
        {
        
                $inc: { 
                    earnedIncentives:sales.incentive,
                    achievedTargets:1,
                    pendingIncentives: - sales.incentive,
                 pendingTargets:-1
                } 
              

        },
       
        );

        const promoter=await Promoter.findOneAndUpdate({
           _id:new mongoose.Types.ObjectId(sales.promoterId)
        },{
            $inc:{
                wallet : sales.incentive
            }
        },
        {new:true}
      );

        const targetsAndBonus= await TargetsAndBonuses.findOneAndUpdate({
          month:istDateTime.month,
          year:istDateTime.year

        },{
          $inc: { 
            achievedTargets:1,
            targetCompleted:sales.price,
            incentivesRecieved:sales.incentive
           
        } 
        },
      {
        new:true
      }) ;

        if((targetsAndBonus.targetCompleted==targetsAndBonus.monthTarget) && targetAcheived=="NO"){

          const targetsAndBonus2= await TargetsAndBonuses.findOneAndUpdate({
            month:istDateTime.month,
            year:istDateTime.year
  
          },{
            $inc: { 
              
              incentivesRecieved:targetsAndBonus.bonus
             
          } ,
          bonusAddedDate:logDate,
          targetAcheived:"YES"

          },
        {
          new:true
        }) ;

        const promoter=await Promoter.findOneAndUpdate({
          _id:req.userId
        },
      {
        $inc:{
          wallet:targetsAndBonus.bonus
        }
      },{
        new:true
      })
        }
        
          
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
         title: "Sale Approval",
         body: "your sale has been accepted",
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
       title: "Sale Approval",
       description: "your Sale has been approved",
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
       
        //console.log(sales,updateIncentive,promoter,targetsAndBonus2)

         if (sales) {
            res.status(200).json({ 
                message: " details  has been fetched",
                data: sales
        
        });
          } else {
            res.status(400).json({ message: "Bad request" });
          }
        } catch (err) {
          console.log(err);
          res.status(400).json({ message: err.message || "Bad request" });
        }
       }

  exports.rejectSales=  async (req,res)=>{
    const istDateTime = DateTime.now().setZone("Asia/Kolkata");
      console.log(istDateTime)      
      const logDate = istDateTime.toISO({ includeOffset: true });
      const time = istDateTime.toFormat("hh:mm a");
        const  promoterId=req.body.promoterId;
        const saleId=req.body.saleId;
        const reason=req.body.reason
        try{
            const sales=await Sales.findOneAndUpdate({
                _id: new  mongoose.Types.ObjectId(saleId)
            
             // promoterId:promoterId  
            },{
                status:"rejected",
                reason:reason
            },
           {new: true} ).sort({saleDate:-1})
        console.log(sales);


        const incentives=await Incentive.findOneAndUpdate(
          {
            promoterId:promoterId   
          },
          { 
            $inc: { 
              pendingIncentives: - (sales.incentive),
              pendingTargets:-1
            } ,
          
          },
          { new: true }
          )
    
            // const  updateIncentive=await Incentive.findOneAndUpdate(
            //     {
                
            //        promoterId:sales.promoterId,
                
            // },
            // {
            
            //         $inc: { 
            //             earnedIncentives:sales.incentive,
            //             achievedTargets:1,
            //             pendingIncentives: - sales.incentive,
            //          pendingTargets:-1
            //         } 
                  
    
            // },
           
            // )
            // const promoter=await Promoter.findOneAndUpdate({
            //    _id:new mongoose.Types.ObjectId(sales.promoterId)
            // },{
            //     $inc:{
            //         wallet : sales.incentive
            //     }
            // })
           
          //  console.log(sales)

    const promoter=await Promoter.findOne({_id:promoterId})          
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
         title: "Sale Rejected",
         body: "your sale has been rejected , please try again",
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
       title: "Sale Rejected",
       description: "your sale has been rejected , please try again",
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
    
             if (sales) {
                res.status(200).json({ 
                    message: " details  has been fetched",
                    data: sales
            
            });
              } else {
                res.status(400).json({ message: "Bad request" });
              }
            } catch (err) {
              console.log(err);
              res.status(400).json({ message: err.message || "Bad request" });
            }
           }

   exports. walletApproval= async (req,res)=>{
    const istDateTime = DateTime.now().setZone("Asia/Kolkata");
      console.log(istDateTime)      
      const logDate = istDateTime.toISO({ includeOffset: true });
      const time = istDateTime.toFormat("hh:mm a");
      const promoterId=req.body.promoterId;
      const walletRequestId=req.body.walletRequestId;
      const transactionId= req.body.transactionId;
      try{
        const wallet=await WalletRequest.findOneAndUpdate({
          _id: new  mongoose.Types.ObjectId(walletRequestId)
      },{
          status:"paid",
          transactionId:transactionId
      },
     {new: true} ).sort({logCreatedDate:1});
  console.log(wallet)
  const promoter=await Promoter.findOne({
    _id:wallet.promoterId
  })
      

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
     title: "Wallet Request Withdrawal Approval",
     body: "your Wallet Request Withdrawal has been approved",
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
   title: "Wallet Request Withdrawal Approval",
   description: "your Wallet Request Withdrawal has been approved",
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
      
      if (wallet) {
    res.status(200).json({ 
        message: "withdrawal request  has been approved",
        data: wallet

      });
        } else {
    res.status(400).json({ message: "Bad request" });
      }
     } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message || "Bad request" });
      }
   }
   exports.walletRejection= async (req,res)=>{
     const promoterId=req.body.promoterId;
      const walletRequestId=req.body.walletRequestId;
      const transactionId= req.body.transactionId;
      const reason=req.body.reason;
      const istDateTime = DateTime.now().setZone("Asia/Kolkata");
      console.log(istDateTime)      
      const logDate = istDateTime.toISO({ includeOffset: true });
      const time = istDateTime.toFormat("hh:mm a");
      try{
        const wallet=await WalletRequest.findOneAndUpdate({
          _id: new  mongoose.Types.ObjectId(walletRequestId)
      },{
          status:"rejected",
          reason:reason
      },
     {new: true} ).sort({logCreatedDate:1});
  console.log(wallet)
      const walletUpdate=await Promoter.findOneAndUpdate({
             _id:wallet.promoterId
      },{
        $inc: { wallet: wallet.amount }
      },
      {new:true})

      
      if (wallet) {
        let usersArr=[];
        let usersIdsArr=[];
         
          // const users = await Promoter.find(query, { fcmToken: 1, _id: 1 });
         //  console.log(users,"kk")
           const usersArray = walletUpdate.fcmToken;
           const usersIds =  walletUpdate._id;
           usersArr.push(usersArray);
           usersIdsArr.push(usersIds);
      
            // const flattenedUsersArr = usersArr.flat().filter(Boolean);
       // const flattenedUsersIdsArr = usersIdsArr.flat().filter(Boolean);
       // console.log("flattenedUsersArr", flattenedUsersArr);
      // console.log("flattenedUsersIdsArr", flattenedUsersIdsArr);
       const message = {
         registration_ids: usersArr,
         notification: {
           title: "Wallet Request Withdrawal",
           body: "your Wallet Request Withdrawal has been rejected",
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
         title: "Wallet Request Withdrawal ",
         description: "your Wallet Request Withdrawal has been rejected",
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
        message: "withdrawal request  has been  rejected",
        data: wallet

      });
        } else {
    res.status(400).json({ message: "Bad request" });
      }
     } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message || "Bad request" });
      }
   } 

  exports.getPendingWalletRequests= async (req,res)=>{
      const promoterId=req.body.promoterId;
      const walletRequestId=req.body.walletRequestId;


      try{
        const wallet=await  WalletRequest.find(
          {
        promoterId: new  mongoose.Types.ObjectId(promoterId),
        status:"unpaid"
      },
      
      ).sort({logCreatedDate:1});
      const promoter=await Promoter.find({_id:promoterId})
     console.log(wallet)
      
       if (wallet) {
       res.status(200).json({ 
        message: " details  has been fetched",
        data: wallet,
        promoter

      });
        }
         else {
    res.status(400).json({ message: "Bad request" });
      }
     } 
     catch (err) {
 // console.log(err);
  res.status(400).json({ message: err.message || "Bad request" });
}
}

exports.getAllPendingWalletRequests= async (req,res)=>{
  const promoterId=req.body.promoterId;
  const walletRequestId=req.body.walletRequestId;
  const searchQuery=req.query.searchQuery;
  const regex=new RegExp(searchQuery,"i");
  let condition={
    status:"unpaid"
  }
  if (req.query.searchQuery !== "") {
    condition = {
      status: "unpaid",
      $or: [{promoterName:regex  },{promoterMobile:regex},{promoterEmail:regex},
        {promoterStoreName:regex  }],
    };
  }

  try{
    const wallet=await  WalletRequest.aggregate([
      
   {
  $lookup:{
    from:"promoters",
    localField:"promoterId",
    foreignField:"_id",
    as :"promoter"
  }
},
{
  $unwind:"$promoter"
},
{
  $addFields:{
    promoterName:"$promoter.name",
    promoterEmail:"$promoter.email",
    promoterMobile:"$promoter.phone",
    promoterStoreName:"$promoter.storeName",
    promoterProfilePic:"$promoter.profilePic"
  }
},
{
  $project:{
    promoter:0
  }
}
,
{
  $match:condition
},


  
]);
//const promoter=await Promoter.find({_id:promoterId})

 console.log(wallet)
  
   if (wallet) {
   res.status(200).json({ 
    message: " details  has been fetched",
    data: wallet,
   

  });
    }
     else {
res.status(400).json({ message: "Bad request" });
  }
 } 
 catch (err) {
 console.log(err);
res.status(400).json({ message: err.message || "Bad request" });
}
}

exports.getRejectedWalletRequests= async (req,res)=>{
  const promoterId=req.body.promoterId;
  const walletRequestId=req.body.walletRequestId;
  const searchQuery=req.query.searchQuery;
  const regex=new RegExp(searchQuery,"i");
  let condition={
    status:"rejected"
  }
  if (req.query.searchQuery !== "") {
    condition = {
      status: "rejected",
      $or: [{promoterName:regex  },{promoterMobile:regex},{promoterEmail:regex},
        {promoterStoreName:regex  }],
    };
  }

  try{
    const wallet=await  WalletRequest.aggregate([

      {
        $sort:
        {
          logCreatedDate:-1
        }
      },
      
   {
  $lookup:{
    from:"promoters",
    localField:"promoterId",
    foreignField:"_id",
    as :"promoter"
  }
},
{
  $unwind:"$promoter"
},
{
  $addFields:{
    promoterName:"$promoter.name",
    promoterEmail:"$promoter.email",
    promoterMobile:"$promoter.phone",
    promoterStoreName:"$promoter.storeName",
    promoterProfilePic:"$promoter.profilePic"
  }
},
{
  $project:{
    promoter:0
  }
},
{
  $match:condition
},


  
]);
//const promoter=await Promoter.find({_id:promoterId})

 console.log(wallet)
  
   if (wallet) {
   res.status(200).json({ 
    message: " details  has been fetched",
    data: wallet,
   

  });
    }
     else {
res.status(400).json({ message: "Bad request" });
  }
 } 
 catch (err) {
 console.log(err);
res.status(400).json({ message: err.message || "Bad request" });
}
}
