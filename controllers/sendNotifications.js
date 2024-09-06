const Notifications=require("../../models/notification");
const Admin = require("../../models/admin");
const Promoter=require("../../models/promoters");
//const { deletePromoters } = require("../promoters/promoter");


exports.addNotification = async function (req, res) {
    try {
      const istDateTime = DateTime.now().setZone("Asia/Kolkata");
      const logDate = istDateTime.toISO({ includeOffset: true });
      const time = istDateTime.toFormat("hh:mm a");
      console.log(req.body.userList) 
      let userList = req.body.userList ? (req.body.userList) : [];
      console.log(userList)
      // let query={}
      // if(userList=="All"){
      //   let query = {
       
      //     notification_bell: true,
      //     status: true,
      //     fcmToken: { $exists: true },
      //   };
      // }else{
      //  let query={}
        if(userList.length>0 && userList!="All"){
          userList=userList.map((item)=>item.value)
        }
       let  query = {
          _id: { $in: userList },
          notification_bell: true,
          status: true,
          fcmToken: { $exists: true },
        };
     // }
      
      const condition = {
        notification_bell: true,
        status: true,
        fcmToken: { $exists: true },
      };
      let usersArr = [];
      let usersIdsArr = [];
      if (userList=="All") {
        if (req.body.sendTo === "Admin") {
          const admins = await Admin.find(condition, { fcmToken: 1, _id: 1 });
          const adminArray = admins.map((item) => item.fcmToken);
          const adminIds = admins.map((item) => item._id);
          usersArr.push(adminArray);
          usersIdsArr.push(adminIds);
        } else if (req.body.sendTo === "Promoter") {
          const users = await Promoter.find(condition, { fcmToken: 1, _id: 1 });
          const usersArray = users.map((item) => item.fcmToken);
          const usersIds = users.map((item) => item._id);
          usersArr.push(usersArray);
          usersIdsArr.push(usersIds);
        } else {
          console.log(11111111111111111111)
         // const users = await Admin.find(condition, { fcmToken: 1, _id: 1 });
          const promoters = await Promoter.find(condition, { fcmToken: 1, _id: 1 });
         // const usersArray = users.map((item) => item.fcmToken);
          const promotersArray = promoters.map((item) => item.fcmToken);
         // const usersIds = users.map((item) => item._id);
          const promoterIds = promoters.map((item) => item._id);
          usersArr.push([ ...promotersArray]);
          usersIdsArr.push([ ...promoterIds]);
          console.log(promoterIds,"pppp",promoters)
        }
      } else if( userList.length > 0) {
        if (req.body.sendTo === "Admin") {
          const admins = await Admin.find(query, { fcmToken: 1, _id: 1 });
          const adminsArray = admins.map((item) => item.fcmToken);
          const adminIds = admins.map((item) => item._id);
          usersArr.push(adminsArray);
          usersIdsArr.push(adminIds);
        } else if (req.body.sendTo === "Promoter") {
          const users = await Promoter.find(query, { fcmToken: 1, _id: 1 });
          console.log(users,"kk")
          const usersArray = users.map((item) => item.fcmToken);
          const usersIds = users.map((item) => item._id);
          usersArr.push(usersArray);
          usersIdsArr.push(usersIds);
        }else {
          const users = await Promoter.find(query, { fcmToken: 1, _id: 1 });
          console.log(users,"kk")
          const usersArray = users.map((item) => item.fcmToken);
          const usersIds = users.map((item) => item._id);
          usersArr.push(usersArray);
          usersIdsArr.push(usersIds);
        }
      }
      const flattenedUsersArr = usersArr.flat().filter(Boolean);
      const flattenedUsersIdsArr = usersIdsArr.flat().filter(Boolean);
      // console.log("flattenedUsersArr", flattenedUsersArr);
      console.log("flattenedUsersIdsArr", flattenedUsersIdsArr);
      const message = {
        registration_ids: flattenedUsersArr,
        notification: {
          title: req.body.title,
          body: req.body.description,
        },
      };
      // fcm.send(message, function (err, response) {
      //   if (err) {
      //     console.log("Failed to send notification:", err);
      //   } else {
      //     console.log("Successfully sent notification with response:", response);
      //   }
      // });
  
      const savenotification = await Notifications.create({
        date: logDate.slice(0, 10),
        time,
        title: req.body.title,
        description: req.body.description,
        type: "Admin",
        image: req.file ? req.file.path : console.log("no notification image"),
        sendTo: req.body.sendTo,
        users: flattenedUsersIdsArr,
        notificationType: req.body.notificationType
          ? (req.body.notificationType)
          : null,
        logCreatedDate: logDate,
        logModifiedDate: logDate,
      });
  
      if (savenotification) {
        res.status(200).json({ message: "Notification has been added" });
      } else {
        res.status(400).json({ message: "Bad request" });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message || "Bad request" });
    }
  };



  exports.addNotification2=async (req,res)=>{
    try{
        const istDateTime = DateTime.now().setZone("Asia/Kolkata");
        const logDate = istDateTime.toISO({ includeOffset: true });
        const time = istDateTime.toFormat("hh:mm a");
        const userList = req.body.users ? JSON.parse(req.body.users) : [];
        let query = {
          _id: { $in: userList },
          notification_bell: true,
          status: true,
          fcmToken: { $exists: true },
        };
        const condition = {
          notification_bell: true,
          status: true,
          fcmToken: { $exists: true },
        };
        let usersArr = [];
        let usersIdsArr = [];
    }catch(err){

    }
  }

  exports.getNotifications = async  (req, res) =>{
    let type=req.body.type
    try {
      let condition = {};
      let regex = new RegExp(req.body.type, "i");
      if (type) {
        console.log(1)
        condition = {
          $or: [{ description: req.body.title }, { title: req.body.title }],
        };
      }
      // condition.doctorId = req.userId;
      // condition.users = { $in: [new mongoose.Types.ObjectId(req.body.userId)] };  
      // condition.type = req.body.type;
      console.log(regex,condition);
  
      const notifications = await Notifications.find(condition).sort({
        logCreatedDate: -1,
      });
      if (notifications) {
        res.status(200).json({
          message: "Successful",
          notifications: notifications,
        });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ success: false, message: "Something went wrong" });
    }
  };


  exports.deleteNotification = async function (req, res) {
    try {
      const notification = await Notifications.findOneAndDelete({
        _id: req.body.id,
      });
      if (notification) {
        res.status(200).json({ message: "Notifications have been deleted" });
      } else {
        res.status(400).json({ message: "Bad request" });
      }
    } catch (err) {
      res.status(400).json({ message: err.message ?? "Bad request" });
    }
  };
