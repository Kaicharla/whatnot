const Sales=require("../../models/sales");
const Incentive=require("../../models/promoter_incentives");
const Promoter=require("../../models/promoters");
//const { default: mongoose } = require("mongoose");


exports.getPassbook= async (req,res)=>{
    const promoterId=req.userId;
    console.log(promoterId)
    let month=req.body.month;
    let year=req.body.year;
    const istDateTime = DateTime.now().setZone("Asia/Kolkata");
    const logDate = istDateTime.toISO({ includeOffset: true });
    let date = DateTime.local();
    if(month){
       date=DateTime.fromObject({ year:DateTime.now().year, month, day: 1 });
       if(year){
        date=DateTime.fromObject({ year, month, day: 1 });
       }
    }
    try{
     const getDetails=await Sales.aggregate([
        {
            $match:{
                promoterId:new mongoose.Types.ObjectId ( promoterId),
                status:"approved",
                logCreatedDate: { 
                    $gte: date.startOf('month').toISO({ includeOffset: true }),
                    $lte: date.endOf('month').toISO({ includeOffset: true })
                }

        }
    },{
        $lookup: {
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
        $addFields: {
          promoterName: "$promoter.name",
          joinedDate: "$promoter.logCreatedDate",
          
        }},{
            $project: {
                promoter:0,
                logCreatedDate:0,
                saleDate:0
            }
        }
    //   {
    //     $unwind: "$promoter" // Since $lookup returns an array, we unwind to destructure it
    //   },
   

     ]);

     const getMonthIncentives=await Sales.aggregate([
        {
        $match:{
        promoterId :new mongoose.Types.ObjectId(promoterId),
        status: "approved",
        logCreatedDate: { 
            $gte: date.startOf('month').toISO({ includeOffset: true }),
            $lte: date.endOf('month').toISO({ includeOffset: true })
        }
         }
       },
       {
        $group: {
          _id:"$promoterId",
          totalEarnedIncentives: { $sum: "$incentive" } // Sum earnedIncentives for all documents matching the filter
        }
    }
    ]);

    const getIncentives=await Incentive.findOne({
      promoterId : new mongoose.Types.ObjectId(promoterId)
     })

     console.log(getMonthIncentives,getDetails,getDetails!=[])
     res.status(200).json({   
        promoterId: getDetails[0]? getDetails[0].promoterId : null,
        promoterName:(await Promoter.findOne({_id:promoterId})).name,//getDetails[0]? getDetails[0].promoterName:null,
        totalEarnedIncentives:getMonthIncentives[0]? getMonthIncentives[0].totalEarnedIncentives:0,
        targetAcheived:getDetails[0]? getDetails.length:0,
        getIncentives,
        data:[...getDetails],
        joinDate: DateTime.fromISO((await Promoter.findOne({_id:promoterId})).logCreatedDate).toFormat('dd-MM-yy'),
        message: "Your incentives has been fetched successfully",
      });
    }catch(err){
        console.log(err)
      return res.status(400).json({ message: err.message ?? "Bad request" });
    }
};
