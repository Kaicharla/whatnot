const Promoter= require("../../models/promoters");
const Otp = require("../../models/otp");



exports.promoterLogin=async (req,res)=>{
    try{
   console.log(req.url)
    const email=req.body.email;
    const username=req.body.username;
    const password=req.body.password;
    const mobile_number=req.body.mobile_number;
    const fcmToken=req.body.fcmToken;

    const user=await Promoter.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }],
        status: true,});
    if(user){
        if(bcrypt.compareSync(password, user.password)){
          let token = jwt.sign(
            {
              userId: user._id,
              password: user.password,
              phone: user.phone,
              email: user.email,
            },
            process.env.ADMIN_ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ADMIN_ACCESS_TOKEN_EXPIRY }
          );
          
          const promoter= await Promoter.findOneAndUpdate({
            email:email
          },{
           isLoggedIn:true,
           fcmToken:fcmToken

          })
           res.status(200).send({"code":200,"message":"sucessfully logged in","token":token,"user":user}) ;
        }else{
           res.status(400).send({"code":400,"message":"wrong password"}) ;
        }
    }else{
        res.status(400).send({"code":400,"message":"please register"}) ;
    }
    }
     catch(e){
      console.log(e)
    res.status(400).send({"code":400,"message":"try again"}) ;
     }
}


exports.
promoterRegistrastion=async (req,res,promoterId)=>{
    try{

    // const email=req.body.email;
    // const username=req.body.username;
    // const password=req.body.password;
    // const monthTarget=req.body.monthTarget;
   // const promoterId=req.body.promoterId;
    const email_exist=await Promoter.findOne({_id:promoterId});
    
    //   const role = await Role.findOne({
    //     _id: req.body.roleId,
    //   });
      let password=promoterId.slice(10,19);
      console.log(password,"password")
        const encryptedPassword=bcrypt.hashSync(password, 10);
        const signIn=await Promoter.findOneAndUpdate({
          _id:promoterId
        },{
          // email:email,
          // monthTarget,
          password:encryptedPassword,
          status:true
         // name:username,
         // roleId: req.body.roleId,
          //permissions:role? role.permissions: [{ all: true }],
          //role: role? role.role : "Promoter",
        })
        if(signIn){
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
        let mailOptions = {
          from: process.env.EMAIL_FROM,
          to: signIn.email,
          
          subject: "whatNot",
          html: `<html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to Our Store!</title>
          </head>
          <body>
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #333;">Your New Password and Welcome!</h2>
                  <p>Your login credential Password:</p>
                  <ul>
                      <li><strong>Password:</strong> ${password}</li>
                  </ul>
                  <p>Use these details to access our store and manage your sales. Need assistance? Reach out to us anytime.</p>
                  <p>Thank you for choosing us.</p>
                  
                  <p>We're excited to have you onboard!</p>
                  <p>Warm regards,<br>
                     What Not
                  </p>
              </div>
          </body>
          </html>`
         
        }
        transporter.sendMail(mailOptions, function (error, success) {
          if (error) {
            console.log(error);
          }
          if (success) {
            console.log("email sent successfully");
          }
        });
      }
        res.send({"code":200,"msg":"user password generated successfully"}) ;
    
    }
     catch(e){
    console.log(e);
    res.send({"code":400,"msg":"try again"}) ;
     }
}
 

exports.changePromoterpasswordByAdmin=async (req,res)=>{
  {
    try {
      const istDateTime = DateTime.now().setZone("Asia/Kolkata");
      console.log(istDateTime)      
      const logDate = istDateTime.toISO({ includeOffset: true });
      
      //const email=req.body.email;
     // const password = req.body.password;
     const promoterId=req.body.promoterId;
      const newpassword = req.body.newpassword;
      const confirmpassword = req.body.confirmpassword;

      if(newpassword==confirmpassword){
         
        const userPass = await Promoter.findOne({ _id: promoterId });
 
            const bcryptedpassword = bcrypt.hashSync(confirmpassword, 10);
           const updated_field= await Promoter.findOneAndUpdate(
              { _id:promoterId },
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
            const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.EMAIL_FROM,
                pass: process.env.EMAIL_PASSWORD,
              },
            });
            let mailOptions = {
              from: process.env.EMAIL_FROM,
              to: userPass.email,
              
              subject: "whatNot",
              html: `<html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Welcome to Our Store!</title>
              </head>
              <body>
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                      <h2 style="color: #333;">Your New Password and Welcome!</h2>
                      <p>Your login credential Password:</p>
                      <ul>
                          <li><strong>Password:</strong> ${confirmpassword}</li>
                      </ul>
                      <p>Use these details to access our store and manage your sales. Need assistance? Reach out to us anytime.</p>
                      <p>Thank you for choosing us.</p>
                      
                      <p>We're excited to have you onboard!</p>
                      <p>Warm regards,<br>
                         What Not
                      </p>
                  </div>
              </body>
              </html>`
             
            }
            transporter.sendMail(mailOptions, function (error, success) {
              if (error) {
                console.log(error);
              }
              if (success) {
                console.log("email sent successfully");
              }
            });

            return res.json({
            data:updated_field,
              message: "Password is updated successfully",
            });
         
      }

      else{
        return res.status(400).json({ message:"passwords not matched" });
      }

 
        
        
      
     
    } catch (err) {
      return res.status(400).json({ message: err.message ?? "Bad request" });
    }
  };

}



exports.generateOtp = async (req, res)=> {
    const senderEmail = req.body.email;
    const user = await Promoter.findOne({ email: req.body.email });
    if (user) {
      function generateOTP() {
        // Generate a random 6-digit number
        const otp = Math.floor(100000 + Math.random() * 900000);
        return otp.toString(); // Convert to string to ensure it's exactly 6 digits
      }
  
      
      let onetimePassword = generateOTP();

     const userotp=await Otp.findOne({email:senderEmail});
     let otpSave=""
      if(userotp){
          otpSave=await Otp.updateMany({email:senderEmail},{otp:onetimePassword})
      }else{
         otpSave = await Otp.create({
            otp: onetimePassword,
            email: senderEmail,
          });
      }
      
      if (otpSave) {
        const userData = await Promoter.findOne(
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
            <p>Dear ${userData.name},</p>
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
            console.log(error)
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
      const result=await Promoter.findOne({email:email});
      console.log(result,"ressss",result._id)
      if(result){
         if (result.status==true && result.kycStatus=="approved"){
        await this.promoterRegistrastion(req,res,result._id.toString())
         }
        else{
          if(result.kycStatus=="pending"){
            return res.status(400).json({ message: " your kyc status is in Pending "});
          }
          else if(result.kycStatus=="rejected"){
            return res.status(400).json({ message: " your kyc has been rejected "});
          }else{
            return res.status(400).json({ message: "the user has deleted account "});
          }
          
 
        }
      }else{
        return res.status(400).json({ message: "the user with this email does not exits"});
      }
       
  
         
          //   const bcryptedpassword = bcrypt.hashSync(confirmpassword, 10);
          //  const updated_field= await Promoter.findOneAndUpdate(
          //     { email:email },
          //     {
          //       $set: {
          //         password: bcryptedpassword,
          //         logModifiedDate: logDate,
          //       },
          //     },
          //     {
          //       new: true,
          //     }
          //   );
          //   if(updated_field){
          //       return res.json({
          //           message: "Password is updated successfully",
          //         });
          //   }
           
          
        
      
     
    } catch (err) {
      return res.status(400).json({ message: err.message ?? "Bad request" });
    }
  };

  // exports.forgotPassword = async  (req, res)=> {
  //   try {
  //     const istDateTime = DateTime.now().setZone("Asia/Kolkata");
  //     console.log(istDateTime)      
  //     const logDate = istDateTime.toISO({ includeOffset: true });
      
  //     const email=req.body.email;
  //     const otp = req.body.otp;
  //     const newpassword = req.body.newpassword;
  //     const confirmpassword = req.body.confirmpassword;

  //     if (otp == null || otp == undefined || otp == "") {
  //       return res.status(400).json({ message: "Please enter OTP" });
  //     }else{
  //       const userPass = await Otp.findOne({ email: email }, { otp: 1 });
  //       console.log(email,userPass)
  //       if (otp == userPass.otp) {
  //         if (newpassword == confirmpassword) {
  //           const bcryptedpassword = bcrypt.hashSync(confirmpassword, 10);
  //          const updated_field= await Promoter.findOneAndUpdate(
  //             { email:email },
  //             {
  //               $set: {
  //                 password: bcryptedpassword,
  //                 logModifiedDate: logDate,
  //               },
  //             },
  //             {
  //               new: true,
  //             }
  //           );
  //           if(updated_field){
  //               return res.json({
  //                   message: "Password is updated successfully",
  //                 });
  //           }
           
  //         } else {
  //           return res.status(400).json({ message: "New password does not match" });
  //         }
  //       } else {
  //         return res.status(400).json({ message: "Invalid OTP" });
  //       }
  //     }
     
  //   } catch (err) {
  //     return res.status(400).json({ message: err.message ?? "Bad request" });
  //   }
  // };

  exports.changePromoterpassword = async  (req, res)=> {
    try {
      const istDateTime = DateTime.now().setZone("Asia/Kolkata");
      console.log(istDateTime)      
      const logDate = istDateTime.toISO({ includeOffset: true });
      
      const email=req.body.email;
      const password = req.body.password;
      const newpassword = req.body.newpassword;
      const confirmpassword = req.body.confirmpassword;

      if (password == null || password == undefined || password == "") {
        return res.status(400).json({ message: "Please enter current password" });
      }else{
        const userPass = await Promoter.findOne({ email: email }, { password: 1 });
        let currentPassVal = bcrypt.compareSync(password, userPass.password);
        if (currentPassVal === true) {
          if (newpassword == confirmpassword) {
            const bcryptedpassword = bcrypt.hashSync(confirmpassword, 10);
           const updated_field= await Promoter.findOneAndUpdate(
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
            return res.json({
            data:updated_field,
              message: "Password is updated successfully",
            });
          } else {
            return res.status(400).json({ message: "New password does not match" });
          }
        } else {
          return res.status(400).json({ message: "Invalid Old Password" });
        }
      }
     
    } catch (err) {
      return res.status(400).json({ message: err.message ?? "Bad request" });
    }
  };



  exports.promoterLogout=async (req,res)=>{
    const promoterId=req.body.promoterId;
       try{
         const promoter=await Promoter.findOneAndUpdate({
          _id:promoterId
        },
        {
          isLoggedIn:false
        })
        if(promoter){
          res.status(200).json({
            message: "Your profile  logged out successfully",
           // data: admin
          });
        } else {
          res.status(400).json({
            message: "no user found",
          });
       }
      }
       catch(err){
        console.log(err);
        res.status(400).json({
          message: "Bad request",
          error: err,
        });
       }
  };


  exports.deleteAccount= async (req,res)=>{
   const promoterId=req.userId;
   try{
    const promoter=await Promoter.findOneAndUpdate({
     _id:promoterId
   },
   {
     $unset: { password: '' } ,
     isLoggedIn:false,
     kycStatus:"pending",
     status:false
   })
   if(promoter){
     res.status(200).json({
       message: "Your profile  deleted successfully",
      // data: admin
     });
   } else {
     res.status(400).json({
       message: "no user found",
     });
  }
 }
  catch(err){
   console.log(err);
   res.status(400).json({
     message: "Bad request",
     error: err,
   });
  }
  }