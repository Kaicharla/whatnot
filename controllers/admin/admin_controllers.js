/** @format */

const Otp = require("../../models/otp");
const Admin = require("../../models/admin");
const Role = require("../../models/rolesAndPermissions");
const FAQ = require("../../models/faq");
const Policies = require("../../models/policies");
const ContactUs = require("../../models/contact");

exports.adminLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const mobile_number = req.body.mobile_number;
    const fcmToken = req.body.fcmToken;
    const user = await Admin.findOne({
      email: req.body.email,
      status: true,
    });
    console.log(req.userID,"kkkkkkkkkkk",user);
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        let token = jwt.sign(
          {
            userId: user._id,
            password: user.password,
            email: user.email,
          },
          process.env.ADMIN_ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.ADMIN_ACCESS_TOKEN_EXPIRY }
        );
        const admin = await Admin.findOneAndUpdate(
          {
            email: email,
          },
          {
            isLoggedIn: true,
            fcmToken: fcmToken,
          }
        );
        res
          .status(200)
          .json({ message: "sucessfully logged in", token: token, user: user });
      } else {
        res.status(400).json({ message: "wrong password" });
      }
    } else {
      res.status(400).json({ message: "user not found" });
    }
  } catch (e) {
    console.log(e);
    res.send({ code: 400, msg: "try again" });
  }
};

exports.adminRegistrastion = async (req, res) => {
  try {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const email_exist = await Admin.findOne({ email: email });
    if (email_exist) {
      console.log(email_exist);
      res.send({ code: 400, msg: "user with same email already exists" });
    } else {
      const role = await Role.findOne({
        _id: req.body.roleId,
      });
      const encryptedPassword = bcrypt.hashSync(password, 10);
      const signIn = await Admin.create({
        email: email,
        password: encryptedPassword,
        username: username,
        roleId: req.body.roleId,
        permissions: role ? role.permissions : [{ all: true }],
        role: role ? role.role : "admin",
      });
      // console.log(signIn);
      res.send({ code: 200, msg: "user created successfully" });
    }
  } catch (e) {
    console.log(e);
    res.send({ code: 400, msg: "try again" });
  }
};

exports.generateOtp = async (req, res) => {
  const senderEmail = req.body.email;
  const user = await Admin.findOne({ email: req.body.email });
  if (user) {
    function generateOTP() {
      // Generate a random 6-digit number
      const otp = Math.floor(100000 + Math.random() * 900000);
      return otp.toString(); // Convert to string to ensure it's exactly 6 digits
    }

    let onetimePassword = generateOTP();

    const userotp = await Otp.findOne({ email: senderEmail });
    let otpSave = "";
    if (userotp) {
      otpSave = await Otp.updateMany(
        { email: senderEmail },
        { otp: onetimePassword }
      );
    } else {
      otpSave = await Otp.create({
        otp: onetimePassword,
        email: senderEmail,
      });
    }

    if (otpSave) {
      const userData = await Admin.findOne(
        { email: senderEmail }
        // { _id: 1, email: 1 }
      );

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_FROM,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      let mailOptions = {
        from: process.env.EMAIL_FROM,
        to: `${senderEmail}`,

        subject: "Reset  password",
        html: `<!doctype html>
          <body>
            <p>Dear ${userData.username},</p>
           <p>We received your request to reset your password. Kindly create your new password using this code: <strong>${onetimePassword}</strong><br>Please reply to this email if you have any questions.</p>
           <p>Note: OTP valid for 10 minutes.</p>
           </body>
         </html>`,
      };
      transporter.sendMail(mailOptions, function (error, success) {
        if (error) {
          console.log(error);
        }
        if (success) {
          console.log("email sent successfully");
        }
      });

      return res.status(200).json({
        message: "OTP sent successfully to the specified email",
        email: req.body.email,
      });
    }
  } else {
    return res.status(400).json({
      message: "No registered user found with this email",
    });
  }
};

exports.validateOtp= async (req,res)=>{

  try {
    // const istDateTime = DateTime.now().setZone("Asia/Kolkata");
    // console.log(istDateTime)      
    // const logDate = istDateTime.toISO({ includeOffset: true });
    
    const email=req.body.email;
    const otp = req.body.otp;
    

    if (otp == null || otp == undefined || otp == "") {
      return res.status(400).json({ message: "Please enter OTP" });
    }else{
      const userPass = await Otp.findOne({ email: email }, { otp: 1 });
      
      if (otp == userPass.otp) {
        return res.status(200).json({ message: "OTP validated succesfully" });
      } else {
        return res.status(400).json({ message: "Invalid OTP" });
      }
    }
   
  } catch (err) {
    return res.status(400).json({ message: err.message ?? "Bad request" });
  }
}

exports.forgotPassword = async  (req, res)=> {
  try {
    const istDateTime = DateTime.now().setZone("Asia/Kolkata");
    console.log(istDateTime)      
    const logDate = istDateTime.toISO({ includeOffset: true });
    
    const email=req.body.email;
   // const otp = req.body.otp;
    const newpassword = req.body.newpassword;
    const confirmpassword = req.body.confirmpassword;

        if (newpassword == confirmpassword) {
          const bcryptedpassword = bcrypt.hashSync(confirmpassword, 10);
         const updated_field= await Admin.findOneAndUpdate(
            { email:email },
            {
              $set: {
                password: bcryptedpassword,
                logModifiedDate: logDate,
              },
            },
            {
              new: true,
            }
          );
          if(updated_field){
              return res.json({
                  message: "Password is updated successfully",
                });
          }
         
        } else {
          return res.status(400).json({ message: "New password does not match" });
        }
      
    
   
  } catch (err) {
    return res.status(400).json({ message: err.message ?? "Bad request" });
  }
};

exports.changeAdminpassword = async (req, res) => {
  try {
    const istDateTime = DateTime.now().setZone("Asia/Kolkata");
    console.log(istDateTime);
    const logDate = istDateTime.toISO({ includeOffset: true });
    console.log(req.userId,"token")

    const email = req.body.email;
    const password = req.body.password;
    const newpassword = req.body.newpassword;
    const confirmpassword = req.body.confirmpassword;

    if (password == null || password == undefined || password == "") {
      return res.status(400).json({ message: "Please enter current password" });
    } else {
      const userPass = await Admin.findOne({ _id:req.userId }, { password: 1 });
      let currentPassVal = bcrypt.compareSync(password, userPass.password);
      if (currentPassVal === true) {
        if (newpassword == confirmpassword) {
          const bcryptedpassword = bcrypt.hashSync(confirmpassword, 10);
          const updated_field = await Admin.updateOne(
            { _id: req.userId },
            {
              $set: {
                password: bcryptedpassword,
                logModifiedDate: logDate,
              },
            },
            {
              new: true,
            }
          );
          return res.status(200).json({
            message: "Password is updated successfully",
          });
        } else {
          return res
            .status(400)
            .json({ message: "New password does not match" });
        }
      } else {
        return res.status(400).json({ message: "Invalid Old Password" });
      }
    }
  } catch (err) {
    return res.status(400).json({ message: err.message ?? "Bad request" });
  }
};

exports.getAdminDetails = async (req, res) => {
  try {
    console.log(req.userId,"token")
    let email = req.body.email;
    // console.log("req.userId", req.userId);
    const profileResult = await Admin.findOne(
      {
        _id: req.userId,
      },
      {
        __v: 0,
        password: 0,
        adminId: 0,
        adminName: 0,
        logCreatedDate: 0,
        logModifiedDate: 0,
      }
    );
    console.log(profileResult);
    if (profileResult) {
      res.status(200).json({
        message: "Your data was successfully retrived",
        profileResult,
      });
    } else {
      res.status(400).json({ message: "Your data could not be retrived" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message ?? "Bad request" });
  }
};

exports.updateAdminProfile = async function (req, res) {
  try {
    const email = req.body.email;
    const istDateTime = DateTime.now().setZone("Asia/Kolkata");
    //console.log(req.file)

    const logDate = istDateTime.toISO({ includeOffset: true });
    const logDatee = istDateTime.toISO({ includeOffset: false });
    console.log(istDateTime, " ", logDate, "", logDatee);
    const profileResult = await Admin.findOneAndUpdate(
      { _id: req.userId },
      {
        $set: {
          username: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          address: req.body.address,
          profilePicture: req.file
            ? req.file.path
            : console.log("no image update"),
          logModifiedDate: logDate,
        },
      },
      { new: true }
    );
    if (profileResult) {
      res.status(200).json({
        message: "Your profile has been updated successfully",
        data: profileResult,
      });
    } else {
      res.status(400).json({
        message: "email incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Bad request",
      error: error,
    });
  }
};

exports.adminLogout = async (req, res) => {
  const adminId = req.body.adminId;
  try {
    const admin = await Admin.findOneAndUpdate(
      {
        _id: req.userId,
      },
      {
        isLoggedIn: false,
      }
    );
    if (admin) {
      res.status(200).json({
        message: "Your profile  logged out successfully",
        // data: admin
      });
    } else {
      res.status(400).json({
        message: "no user found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Bad request",
      error: err,
    });
  }
};

exports.updateFaqs = async (req, res) => {
  let question_id = req.body.question_id;
  const question = req.body.question;
  const answer = req.body.answer;
  const istDateTime = DateTime.now().setZone("Asia/Kolkata");
  // console.log(istDateTime)
  const logDate = istDateTime.toISO({ includeOffset: true });
  if (question_id) {
    const updated_faq = await FAQ.findOneAndUpdate(
      { _id: question_id },
      {
        question: question,
        answer: answer,
        logModifiedDate: logDate,
      },
      { new: true }
    );

    if (updated_faq) {
      res.status(200).json({
        data: updated_faq,
        message: "Your faq has been updated successfully",
      });
    } else {
      res.status(400).json({
        message: "please update again",
      });
    }
  } else {
    const added_question = await FAQ.create({
      question: question,
      answer: answer,
      logCreatedDate: logDate,
    });
    if (added_question) {
      res.status(200).json({
        data: added_question,
        message: "Your faq has been updated successfully",
      });
    } else {
      res.status(400).json({
        message: "please create again",
      });
    }
  }
};

exports.deleteFaqs= async (req,res)=>{
  const question_id=req.body.question_id;
  try {
      const istDateTime = DateTime.now().setZone("Asia/Kolkata");
      const logDate = istDateTime.toISO({ includeOffset: true });
  
     // const brands = await Brand.find({});
     const deleted_product=await FAQ.deleteMany({ _id: { $in: question_id } })
  
      if (deleted_product.deletedCount<1) {
          return res.status(200).json({
            message: "please try again",
            deleted_Faq: deleted_product ?? {},
          });
        //}
      } else {
        return res.status(200).json({
          message: "Successfull ",
          deleted_Faq: deleted_product ?? {},
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: err.message ?? "Bad request" });
    }
}

exports.getFaqs = async function (req, res) {
  try {
    const istDateTime = DateTime.now().setZone("Asia/Kolkata");
    const logDate = istDateTime.toISO({ includeOffset: true });

    const Faqs = await FAQ.find({});

    if (!Faqs) {
      return res.status(200).json({
        message: "Successful but no faqs",
        Faqs: saveFaqs ?? {},
      });
      //}
    } else {
      return res.status(200).json({
        message: "Successfull ",
        Faqs: Faqs ?? {},
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message ?? "Bad request" });
  }
};

exports.getpolicies = async function (req, res) {
  try {
    const istDateTime = DateTime.now().setZone("Asia/Kolkata");
    const logDate = istDateTime.toISO({ includeOffset: true });

    const policies = await Policies.findOne({});

    if (!policies) {
      return res.status(200).json({
        message: "Successful",
        policies: {},
      });
      // }
    } else {
      return res.status(200).json({
        message: "Successful",
        policies: policies ?? {},
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message ?? "Bad request" });
  }
};

exports.updatepolicies = async function (req, res) {
  const istDateTime = DateTime.now().setZone("Asia/Kolkata");
  // console.log(istDateTime)
  const logDate = istDateTime.toISO({ includeOffset: true });
  const policies= await Policies.countDocuments();
  try {
    if (policies) {
      const updated_policy = await Policies.findOneAndUpdate(
        {},
           
        {
          $set: {
            aboutUs: req.body.aboutUs || console.log("no policies"),
            privacyPolicy: req.body.privacyPolicy || console.log("no policies"),
            claimPolicy: req.body.claimPolicy || console.log("no policies"),
            refundPolicy: req.body.refundPolicy || console.log("no policies"),
            termsCondition:
              req.body.termsCondition || console.log("no policies"),
            logModifiedDate: logDate,
          },
        },
        { new: true }
      );

      if (updated_policy) {
        res.status(200).json({
          data: updated_policy,
          message: "Your policies has been updated successfully",
        });
      } else {
        res.status(400).json({
          message: "please update again",
        });
      }
    } else {
      const added_policy = await Policies.create({
        aboutUs: req.body.aboutUs || console.log("no policies"),
        privacyPolicy: req.body.privacyPolicy || console.log("no policies"),
        claimPolicy: req.body.claimPolicy || console.log("no policies"),
        refundPolicy: req.body.refundPolicy || console.log("no policies"),
        termsCondition: req.body.termsCondition || console.log("no policies"),
        logCreatedDate: logDate,
      });
      console.log(added_policy);
      if (added_policy) {
        res.status(200).json({
          data: added_policy,
          message: "Your policy has been updated successfully",
        });
      } else {
        res.status(400).json({
          message: "please create again",
        });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message ?? "Bad request" });
  }
};

exports.getContactDetails = async function (req, res) {
  try {
    const istDateTime = DateTime.now().setZone("Asia/Kolkata");
    const logDate = istDateTime.toISO({ includeOffset: true });

    const contactDetails = await ContactUs.findOne({});

    if (!contactDetails) {
      return res.status(200).json({
        message: "empty",
        contactDetails: {},
      });
      // }
    } else {
      return res.status(200).json({
        message: "Successful",
        contactDetails: contactDetails ?? {},
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message ?? "Bad request" });
  }
};

exports.updateContactDetails = async (req, res) => {
  const istDateTime = DateTime.now().setZone("Asia/Kolkata");
  // console.log(istDateTime)
  const logDate = istDateTime.toISO({ includeOffset: true });
  const details_id = req.body.contacts_id;
  
    const updated_details = await ContactUs.findOneAndUpdate(
      {},

      {
        $set: {
          officeName: req.body.officeName || console.log("no officeName"),
          officeEmail: req.body.officeEmail || console.log("no officeEmail"),
          officePhonenumber:
            req.body.officePhonenumber || console.log("no officePhonenumber"),
          officeAltPhonenumber:
            req.body.officeAltPhonenumber ||
            console.log("no officeAltPhonenumber"),
          pincode: req.body.pincode || console.log("no pincode"),
          location: req.body.location || console.log("no location"),
          logModifiedDate: logDate,
        },
      },
      { new: true }
    );

    if (updated_details) {
      res.status(200).json({
        data: updated_details,
        message: "Your contact details has been updated successfully",
      });
    } else {
      res.status(400).json({
        message: "please update again",
      });
    }
  
};

const adminImgStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./fileStorage/admin_images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const adminImgMaxSize = 30 * 1024 * 1024;

const upload_adminImg = multer({
  storage: adminImgStorage,
  fileFilter: (req, file, cb) => {
    if (file.originalname.match(/\.(png|PNG|jpg|pdf)$/)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("This file extension is not allowed"));
    }
  },
  limits: { fileSize: adminImgMaxSize },
});


exports.handleUpload = (req, res, next) => {
  upload_adminImg.single("admin_image")(req, res, err => {
      if (err instanceof multer.MulterError) {
        // Multer errors (e.g., file size exceeded)
        return res.status(400).json({message :  err.message });
      } else if (err) {
        // Other errors
        return res.status(500).json({ error: 'Internal server error' });
      }
      // If no errors, move to the next middleware
      next();
    });
  };

// try {
//   console.log(req.body.aboutUs)
//   const upSet = await Policies.updateMany({},

//     {
//       $set: {
//         "aboutUs": req.body.aboutUs ,
//         "privacyPolicy": req.body.privacyPolicy//|| console.log("no policies"),
//         // claimPolicy: req.body.claimPolicy || console.log("no policies"),
//         // refundPolicy: req.body.refundPolicy || console.log("no policies"),
//         // termsCondition: req.body.termsCondition || console.log("no policies"),
//       },
//     },
//     { multi: true }
//   );
//   if (upSet) {
//     return res.status(200).json({data:upSet, message: "Updated successfully" });
//   } else {
//     return res.status(400).json({
//       message: "Bad requesst",
//     });
//   }
// } catch (err) {
//   console.log(err);
//   return res.status(400).json({ message: err.message ?? "Bad request" });
// }
//};

// exports.forgotPassword=async (req,res)=>{
//     try{

//     const email=req.body.email;
//     const username=req.body.username;
//     const encryptedPassword=bcrypt.hashSync(req.body.password,10);
//     const change_password=await Admin.findOneAndUpdate({email:email},{$set:{password:encryptedPassword}}, { new: true });
//     console.log(change_password)
//     if(change_password){
//        res.send({"code":200,"msg":"success"}) ;
//     }else{
//         res.send({"code":400,"msg":"user not found"}) ;
//     }
//     }
//      catch(e){
//     res.send({"code":400,"msg":"try again"}) ;
//      }
// }

// exports.otp_verification=async (req,res)=>{
//     try{
//         const email=req.body.email;
//         const username=req.body.username;
//         const otp = Math.floor(100000 + Math.random() * 900000);

//         const senderEmail = req.body.email;
//         const otpSave = await Otp.create({
//           otp: otp,
//           email: senderEmail,
//           userId: user._id,
//         });
//         if (otpSave) {
//           const userData = await Admin.findOne(
//             { email: senderEmail }
//             // { _id: 1, email: 1 }
//           );}
//     }catch(error){

//     }

// }
