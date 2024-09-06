const express = require("express");
const promoterRoutes = express.Router();
const promoterControllers=require("../../controllers/promoters/promoter");
const salesControllers=require("../../controllers/promoters/sales");
const kycControllers=require("../../controllers/promoters/kyc");
const passbookControllers=require("../../controllers/promoters/passbook");
const loginControllers=require("../../controllers/promoters/logins");
const walletControllers=require("../../controllers/promoters/walletRequest");
const notificationControllers=require("../../controllers/promoters/notifications");
const middleware=require("../../middleware/authentication");
const bannercontroller=require("../../controllers/admin/banners")



//--------------------------promoter Logins and password-------------------------------//

promoterRoutes.post("/promoterLogin",loginControllers.promoterLogin);
promoterRoutes.post("/promoterRegistration",loginControllers.promoterRegistrastion);
promoterRoutes.post("/changePromoterpassword",middleware.authentication,loginControllers.changePromoterpassword);
promoterRoutes.post("/forgotPassword",loginControllers.forgotPassword);
promoterRoutes.post("/generateOtp",loginControllers.generateOtp);
promoterRoutes.post("/validateOtp",loginControllers.validateOtp)
promoterRoutes.post("/promoterLogout",middleware.authentication,loginControllers.promoterLogout);


//---------------------promoter profile------------------------//

promoterRoutes.post("/updatePromoterDetails",
promoterControllers.handleUpload,promoterControllers.updatePromoterDetails);

promoterRoutes.post("/getPromoters",middleware.authentication,promoterControllers.getPromoters);
promoterRoutes.post("/getPromoterById",middleware.authentication,promoterControllers.getPromoterById);
promoterRoutes.post("/deletePromoters",middleware.authentication,promoterControllers.deletePromoters);



//----------------------------sales------------------------------//


promoterRoutes.post("/saleSubmit",middleware.authentication,
salesControllers.handleUploadInvoices,salesControllers.saleSubmit);
promoterRoutes.post("/getIncentivesAndTargets",middleware.authentication,salesControllers.getIncentivesAndTargets);
promoterRoutes.post("/getMonthIncentivesAndTargets",middleware.authentication,salesControllers.getMonthIncentivesAndTargets);


//------------------------KYC----------------------------------------//

promoterRoutes.post("/uploadKyc",kycControllers.handleUploadKyc,kycControllers.uploadKyc);
 promoterRoutes.post("/updateKyc",middleware.authentication,kycControllers.handleUploadKyc,kycControllers.updateKyc);
promoterRoutes.post("/getKycdetails",middleware.authentication,kycControllers.getKycdetails)


//-------------------------------------passbook-------------------------------------------//
promoterRoutes.post("/getPassbook",middleware.authentication,passbookControllers.getPassbook);



//--------------------------------invoices----------------------------//
promoterRoutes.post("/getInvoices",middleware.authentication,salesControllers.getUploadInvoices);



//---------------------------wallets---------------------------------//  getAllWithdrawalRequest
promoterRoutes.post("/addPromoterWalletRequest",middleware.authentication,walletControllers.addPromoterWalletRequest);
promoterRoutes.post("/getAllWithdrawalRequest",middleware.authentication,walletControllers.getAllWithdrawalRequest);


//---------------------------notifications----------------------//

promoterRoutes.post("/getNotificationStatus",middleware.authentication,notificationControllers.getnotificationstatus);
promoterRoutes.post("/updatenotificationstatus",middleware.authentication,notificationControllers.updatenotificationstatus);
promoterRoutes.post("/getallnotifications",middleware.authentication,notificationControllers.getallnotifications);
promoterRoutes.post("/deleteNotification",middleware.authentication,notificationControllers.deleteNotification);
promoterRoutes.post("/deleteAllNotifications",middleware.authentication,notificationControllers.deleteAllNotifications);

//----------------------------------------send Query------------------------------//
promoterRoutes.post("/sendQuery",middleware.authentication,promoterControllers.sendQuery);


//-----------------kyc re-update--------------------//

promoterRoutes.post("/kycUpdateRequest",middleware.authentication,kycControllers.kycUpdateRequest);


//------------------------delete Account-----------------//

promoterRoutes.post("/deleteAccount",middleware.authentication,loginControllers.deleteAccount);


//------------------banners-----------------//

promoterRoutes.post(
    "/getbanners",
    middleware.authentication,
    bannercontroller.getBanners
  );




module.exports = promoterRoutes;