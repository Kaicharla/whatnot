const Sales=require("../../models/sales");
const Incentive=require("../../models/promoter_incentives");
const Promoter=require("../../models/promoters");
const WalletRequest=require('../../models/walletRequest'); 
const Notifications=require("../../models/notification");
const Queries=require("../../models/queries");
const TargetsAndBonuses= require("../../models/targetsAndBonus");
const { truncate } = require("fs");

exports.getQueries= async (req,res)=>{
    const promoterId=req.userId;
    try{
        const queries=await Queries.aggregate([
          
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
            $addFields:{
              promoterName:"$promoter.name",
              promoterEmail:"$promoter.email",
              promoterMobile:"$promoter.phone",
              promoterStoreName:"$promoter.storeName",
              promoterProfilePic:"$promoter.profilePic"
            }
          },
          {
            $sort:{
                logCreatedDate:-1
            }
          }
        ])
        if (queries) {
            res.status(200).json({ 
                message: " details  has been fetched",
                count:queries.length,
                data: queries,
                
        });
          } else {
            res.status(200).json({ message: "no queries" });
          }
        } catch (err) {
          console.log(err);
          res.status(400).json({ message: err.message || "Bad request" });
        }
       }


       exports.setMonthTarget= async (req,res)=>{
        
        const istDateTime = DateTime.now().setZone("Asia/Kolkata");
        console.log(istDateTime)      
        const logDate = istDateTime.toISO({ includeOffset: true });
        const promoterId=req.body.promoterId;
        const bonus=req.body.bonus;
        const month= istDateTime.month;
        const year= istDateTime.year;
        try{
            // const query=await Incentive.findOneAndUpdate({promoterId:promoterId},{
            //     monthTarget:parseInt(req.body.monthTarget)
            // },
            // {
            //     new:true
            // }
            // );
            const targets=await TargetsAndBonuses.findOne({
              promoterId:promoterId,
              month:month,
              year:year
            })
         let queries;
            if(targets){
              queries=await TargetsAndBonuses.findOneAndUpdate({promoterId:promoterId},{
                monthTarget:parseInt(req.body.monthTarget),
                month:month,
                year:year,
                bonus:bonus,
                logCreatedDate:logDate,
                logModifiedDate:logDate
            },
            {
                new:true
            }
            );
            }
            else{
               queries=await TargetsAndBonuses.create({promoterId:promoterId,
                monthTarget:parseInt(req.body.monthTarget),
                month:month,
                bonus:bonus,
                year:year,
                logCreatedDate:logDate,
                logModifiedDate:logDate
            },
            {
                new:true
            }
            );
            }

           
          


            if (queries) {
                res.status(200).json({ 
                    message: "monthly target updated",
                    data: queries,
                    
            });
              } else {
                res.status(200).json({ message: "target not updated" });
              }
            } catch (err) {
              console.log(err);
              res.status(400).json({ message: err.message || "Bad request" });
            }
           }