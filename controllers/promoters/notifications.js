// importing models
const Notifications = require("../../models/notification");
const Promoter = require("../../models/promoters");
//const mongoose = require("mongoose");

// get notification status
exports.getnotificationstatus = async function (req, res) {
  try {
    //console.log(req.userId);
    const promoter = await Promoter.findOne(
      { _id: req.userId },
      { notification_bell: 1 }
    );
    if (promoter) {
      res.status(200).json({ success: true, message: "Success", promoter });
    } else {
      res.status(404).json({ success: false, message: "Promoter not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

// update notification status
exports.updatenotificationstatus = async function (req, res) {
  try {
    // const updatedPromoter = await Promoter.findOneAndUpdate(
    //   { _id: req.userId },
    //   { $set: { notification_bell: req.body.notification_bell } },
    //   { new: true }
    // );
    const notification = await Promoter.findByIdAndUpdate({ _id: req.userId }, [
      { $set: { notification_bell: { $eq: [false, "$notification_bell"] } } },
    ]).select("notification_bell");

    if (notification) {
      res.status(200).json({
        success: true,
        message: "Notification bell has been updated",
        notification: notification,
      });
    } else {
      res.status(404).json({ success: false, message: "Promoter not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// get all notifications
exports.getallnotifications = async function (req, res) {
  try {
    let condition = {};
    let regex = new RegExp(req.query.searchQuery, "i");
    if (req.query.searchQuery !== "") {
      condition = {
        $or: [{ title: regex }, { description: regex }, { name: regex }],
      };
    }
    condition.users = { $in: [new mongoose.Types.ObjectId(req.userId)] };
    console.log(condition);
    const notifications = await Notifications.find(condition, {
      logModifiedDate: 0,
      status: 0,
      users: 0,
      __v: 0,
    }).sort({
      logCreatedDate: -1,
    });

    if (notifications) {
      const unseen = await Notifications.findOneAndUpdate(
        { ...condition, seen: false },
        {
          seen: true,
        }
      );
      res.status(200).json({
        success: true,
        message: "Notification's has been retrived successfully ",
        notifications: notifications,
      });
    }
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: err.message ?? "Bad request" });
  }
};

// delete notification
exports.deleteNotification = async function (req, res) {
  try {
    const userId = req.userId
    const notifyResult = await Notifications.findOne({
      _id: req.body._id
    });
    if (!notifyResult) {
      return res
        .status(400)
        .json({ success: false, message: "Notification not found" });
    }
    let array = notifyResult.users;
    const index = array.findIndex(
      (user) => user.toString() === userId.toString()
    );
    if (index > -1) {
      // Splice array only when the user is found
      array.splice(index, 1); // Remove one item at the found index
    }
    const notificationResult = await Notifications.findOneAndUpdate(
      { _id: req.body._id },
      { users: array },
      { new: true }
    );
    if (!notificationResult) {
      return res.status(400).json({ success: false, message: "Bad request" });
    }
    res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

// delete all notification
exports.deleteAllNotifications = async function (req, res) {
  try {
    const userId = req.userId;
    const notifyResults = await Notifications.find({
      users: { $in: [new mongoose.Types.ObjectId(req.userId)] }, // Finding notifications where userId exists in the users array
    });
    if (!notifyResults || notifyResults.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Notification not found" });
    }
    for (const notifyResult of notifyResults) {
      let array = notifyResult.users;

      const index = array.findIndex(
        (user) => user.toString() === userId.toString()
      );
      if (index > -1) {
        array.splice(index, 1); // Remove the userId from the array
      }
      const notificationResult = await Notifications.findOneAndUpdate(
        { _id: notifyResult._id },
        { users: array },
        { new: true }
      );
      if (!notificationResult) {
        return res
          .status(400)
          .json({ success: false, message: "Error updating notification" });
      }
    }
    res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (err) {
    console.error("Error deleting notification:", err);
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};
