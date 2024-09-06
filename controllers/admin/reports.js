const Incentive = require("../../models/promoter_incentives");
//const promoters = require("../../models/promoters");
const Promoter=require("../../models/promoters");
const Sale = require("../../models/sales");

const WalletRequest=require("../../models/walletRequest");
const Product =require("../../models/products")


exports.getSalesCount=async (req,res)=>{
let condition={status:"approved"}
let date=DateTime.local()
  const month=req.body.month;
  const year=req.body.year;
  if(month){
    date=DateTime.fromObject({ year:DateTime.now().year, month, day: 1 });
    if(year){
     date=DateTime.fromObject({ year, month, day: 1 });
  condition.logCreatedDate=  
       { 
          $gte: date.startOf('month').toISO({ includeOffset: true }),
          $lte: date.endOf('month').toISO({ includeOffset: true })
      }
  
    }
 }
    try{
      console.log(condition)
        const sales= await Sales.find(condition);
        //sales["count"]=sales.length;
        console.log(22)
        if (sales) {
            res.status(200).json({ 
             message: " details  has been fetched",
             count:sales.length,
            // data: sales,
             
     
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


     exports.getAllPromoters=async (req,res)=>{
        const month=req.body.month;
        const year=req.body.year;
        const status=req.body.status;
        let date = DateTime.local();
        let condition={}
       
  const searchQuery=req.query.searchQuery;
  const regex=new RegExp(searchQuery,"i");
  if (req.query.searchQuery !== "") {
    condition = {
      $or: [{name:regex  },{email:regex},{phone:regex}],
      KycStatus:status
    };
  }

        if(month){
          date=DateTime.fromObject({ year:DateTime.now().year, month, day: 1 });
          if(year){
           date=DateTime.fromObject({ year, month, day: 1 });
        condition.logCreatedDate=  {
         
                $gte: date.startOf('month').toISO({ includeOffset: true }),
                $lte: date.endOf('month').toISO({ includeOffset: true })
            
        }
          }
       }
        try{
            const promoters= await Promoter.find(condition).sort({logModifiedDate:-1});
            //sales["count"]=sales.length;
            console.log(promoters)
            if (promoters) {
                res.status(200).json({ 
                 message: " details  has been fetched",
                 count:promoters.length,
                 data: promoters,
                 
         
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

    exports.getAllPayments=async (req,res)=>{
        const month=req.body.month;
        const year=req.body.year;
        let date = DateTime.local();
       let  condition={
        status: "paid"
       }
        if(month){
          date=DateTime.fromObject({ year:DateTime.now().year, month, day: 1 });
          if(year){
           date=DateTime.fromObject({ year, month, day: 1 });
           condition.logCreatedDate=
            //promoterId :new mongoose.Types.ObjectId(promoterId),
             { 
                $gte: date.startOf('month').toISO({ includeOffset: true }),
                $lte: date.endOf('month').toISO({ includeOffset: true })
            }
          }
       }
    const searchQuery=req.query.searchQuery;
    const regex=new RegExp(searchQuery,"i");
    if (req.query.searchQuery !== "") {
      condition = {
        status: "paid",
        $or: [{promoterName:regex  },{promoterMobile:regex},{promoterEmail:regex},
          {promoterStoreName:regex  }],
      };
    }

        try{
            // const sales= await sales.find();
            // //sales["count"]=sales.length;
            // console.log(sales)

            const totalAmount=await WalletRequest.aggregate([
                {
                $match:condition
                //promoterId :new mongoose.Types.ObjectId(promoterId),
               },
              {
                $sort:
                {
                  logCreatedDate:-1
                }
              },

               {
                $group: {
                  _id:null,//"$promoterId",
                  totalIncentives: { $sum: "$amount" } // Sum earnedIncentives for all documents matching the filter
                }
            }
            ])
            
            const totalDebits=await WalletRequest.aggregate([
            
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


            if (totalAmount) {
                res.status(200).json({ 
                 message: " details  has been fetched",
                // count:sales.length,
                totalAmount: totalAmount[0]?totalAmount[0]?.totalIncentives:0,
                totalDebits:totalDebits,
                count:totalDebits.length
                 
         
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


    exports.getPaymentReports=async (req,res)=>{
          const fromDate=req.body.fromDate;
          const toDate=req.body.toDate;
          let date = DateTime.local();
         let  condition={
          status: "paid"
         }
         if(req.body.fromDate!="" && req.body.toDate!=""){
          const istDateTime_f = DateTime.fromISO(req.body.fromDate).setZone("Asia/Kolkata");      
          const fromDate = istDateTime_f.toISO({ includeOffset: true });
          const istDateTime_t = DateTime.fromISO(req.body.toDate).endOf('day').setZone("Asia/Kolkata");      
          const toDate = istDateTime_t.toISO({ includeOffset: true });
            console.log(fromDate,toDate)
                condition.logCreatedDate=
                 //promoterId :new mongoose.Types.ObjectId(promoterId),
                  { 
                     $gte: fromDate,
                     $lte: toDate
                 }
               
            }
          try{
              // const sales= await sales.find();
              // //sales["count"]=sales.length;
              // console.log(sales)
  
              // const totalAmount=await WalletRequest.aggregate([
              //     {
              //     $match:condition
              //     //promoterId :new mongoose.Types.ObjectId(promoterId),
              //    },
              // //    {
              // //     $group: {
              // //       _id:"$promoterId",
              // //       totalIncentives: { $sum: "$amount" } // Sum earnedIncentives for all documents matching the filter
              // //     }
              // // }
              // ])
              console.log(condition)
             // const totalDebits=await WalletRequest.find(condition)
              const totalDebits=await WalletRequest.aggregate([
                  {
                    $match:condition
                  },
                  {
                    $lookup:{
                      from:"promoters",
                      localField:"promoterId",
                      foreignField:"_id",
                      as:"promoter"
                    }
                  },
                  {
                    $unwind:"$promoter"
                  },
                  {
                    $project:{
                      promoterName:"$promoter.name",
                      email:"$promoter.email",
                      phone:"$promoter.phone",
                      promoterStoreName:"$promoter.storeName",
                      transactionId:1,
                      _id: 1,
                       date: 1,
                      time: 1,
            //promoterName": "\"promoters\"",
                      amount: 1,
                      status: 1,
                     promoterId: 1,
                     logCreatedDate: 1,
                     logModifiedDate: 1,
                      //promoter:1
                    }
                  }
              ])
  
              if (totalDebits) {
                  res.status(200).json({ 
                   message: " details  has been fetched",
                  // count:sales.length,
                 // t:totalAmount,
                 // totalAmount: totalAmount[0]?totalAmount[0]?.totalIncentives:0,
                  totalDebits:totalDebits,
                  count:totalDebits.length
                   
           
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

 
    exports.getSalesReports=async (req,res)=>{
    //   const istDateTime_f = DateTime.fromISO(req.body.date[0]).setZone("Asia/Kolkata");      
    //  const fromDate = istDateTime_f.toISO({ includeOffset: true });
    //  const istDateTime_t = DateTime.fromISO(req.body.date[1]).endOf('day').setZone("Asia/Kolkata");      
    //  const toDate = istDateTime_t.toISO({ includeOffset: true });
      //const fromDate=req.body.fromDate;
      ///const toDate=req.body.toDate;
      ///let date = DateTime.local();
      let condition={status:"approved"}
      if(req.body.fromDate!="" && req.body.toDate!=""){
        const istDateTime_f = DateTime.fromISO(req.body.fromDate).setZone("Asia/Kolkata");      
        const fromDate = istDateTime_f.toISO({ includeOffset: true });
        const istDateTime_t = DateTime.fromISO(req.body.toDate).endOf('day').setZone("Asia/Kolkata");      
        const toDate = istDateTime_t.toISO({ includeOffset: true });
          console.log(fromDate,toDate)
              condition.logCreatedDate=
               //promoterId :new mongoose.Types.ObjectId(promoterId),
                { 
                   $gte: fromDate,
                   $lte: toDate
               }
             
          }
           
              try{
              
               const sales=await Sale.aggregate([
                {
                 $match:condition
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
         
  
// exports.dashboardCount= async (req,res)=>{

  
//   try{
              
//     const sales=await Sales.aggregate([
//       {
//         $group: {
//           _id: { 
//             $month: "$saleDate",

//          }, // Extract month from the 'date' field
//           count: { $sum: 1 }
//           //totalSales: { $sum: "$revenue" } // Calculate total revenue for each month
          
//         }
//       },
//       {
//         $unwind:"$_id"
//       }
//    ])
//    const promoters=await Sales.aggregate([
//     {
//       $group: {
//         _id: {
//           month: { $month: "$saleDate" },
//           promoter:"$promoterId"
//         }, // Extract month from the 'date' field
//         count: { $sum: 1 }
//         //totalSales: { $sum: "$revenue" } // Calculate total revenue for each month
        
//       }
//     }
//  ])

//  const promoter=await Promoter.aggregate([
//   {
//     $group: {
//       _id: {
//         month: { $month: { $toDate: "$logCreatedDate" } },
//        // promoter:"$promoterId"
//       }, // Extract month from the 'date' field
//       count: { $sum: 1 }
//       //totalSales: { $sum: "$revenue" } // Calculate total revenue for each month
      
//     }
//   }
// ])
// console.log(promoter,"hhhhhh")


//      if (sales) {
//         res.status(200).json({ 
//             message: " details  has been fetched",
//            //count:sales.length,
//             SaleCount: sales,
//             //promoters:promoters,
//             promoterCount:promoter
            
//     });
//       } else {
//         res.status(400).json({ message: "Bad request" });
//       }
//     } catch (err) {
//       console.log(err);
//       res.status(400).json({ message: err.message || "Bad request" });
//     }


// }


exports.dashboardCount=async (req,res)=>{
  try{
      const months = [
          "01",
          "02",
          "03",
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
          "10",
          "11",
          "12",
        ];
      
        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1;
      
        const totalenquiries = await Promise.all(
          months.map(async (month) => {
      //       const year = new Date().getMonth() < month - 1 ? nextYear :
      // currentYear;
      
            const startDate = DateTime.fromObject({ year: currentYear, month: parseInt(month)}).startOf('month').toISO({ includeOffset: true });
            const endDate =DateTime.fromObject({ year: currentYear, month: parseInt(month)}).endOf('month').toISO({ includeOffset: true })
              // new Date(`${year}-${month}-${new Date(year, month, 0).getDate()}`)
              //   .toISOString()
              //   .slice(0, 10) + "T23:59:59.999Z";
      console.log(endDate,"DDD",startDate)
            let condition = {
              logCreatedDate: {
                $gte: startDate,
                $lt: endDate,
              },
              status:"approved"
            //  status: "true",
            };
      //console.log(condition);
      const sales = await Sale.countDocuments(condition);
    //  const promoters=await Promoter.countDocuments(condition);
      const incentives=  await Sale.aggregate([
        {
        $match:condition
        //promoterId :new mongoose.Types.ObjectId(promoterId),
       },
       {
        $group: {
          _id:null,//"$promoterId",
          totalIncentives: { $sum: "$incentive" } // Sum earnedIncentives for all documents matching the filter
        }
    }
    ]);
    condition.status=true;
    const promoters=await Promoter.countDocuments(condition);
         return {
          sales:sales,
          promoters:promoters,
          incentives: incentives
         }
          })
        );

     const saleStats=totalenquiries.map((month)=> month.sales )
     const promoterStats=totalenquiries.map((month)=> month.promoters )
     const incentiveStats=totalenquiries.map((month)=> month.incentives[0]? month.incentives[0].totalIncentives:0  )
   if (true) {
      res.status(200).json({ 
          message: "details  has been fetched",
          promotersCount:await Promoter.countDocuments(),
          salesCount: await Sale.countDocuments({status:"approved"}),
          totalIncentives:incentiveStats.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue), 0),
          totalProducts:await Product.countDocuments(),
          promoters:await Promoter.find().sort({logCreatedDate:-1}).limit(10),
          saleStats,
          promoterStats,
          incentiveStats,
         

         //count:sales.length,
         // monthlyStats: totalenquiries //forms,
          //promoters:promoters,
          //promoterCount:promoter
          
  });
    } else {
      res.status(400).json({ message: "Bad request" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message || "Bad request" });
  }
}