const express = require("express");
const adminRoutes = express.Router();
// const { verifyAdminToken } = require("../../middleware/verifyToken");
// const { uploadAvatar } = require("../../middleware/mediaUploads");
const adminControllers=require("../../controllers/admin/admin_controllers");
const brandsAndCategories=require("../../controllers/admin/brandsAndCategories");
const notifications=require("../../controllers/admin/sendNotifications");
const kycControllers=require("../../controllers/admin/kyc_approval");
const salesControllers=require("../../controllers/admin/approveSales");
const reportControllers=require("../../controllers/admin/reports");
const bulkUploadControllers=require("../../controllers/admin/bulkUpload");
const promoterRegistrastion=require("../../controllers/promoters/logins");
const queryControllers=require("../../controllers/admin/queriesAndTargets")
const middleware=require("../../middleware/authentication");
const bannercontroller=require("../../controllers/admin/banners");

//const product_image=require("../../controllers/admin/brandsAndCategories")
// // routes

//-------------------admin routes-----------
adminRoutes.post("/adminLogin",adminControllers.adminLogin);
adminRoutes.post("/adminRegister",adminControllers.adminRegistrastion);
adminRoutes.post("/generateOtp",adminControllers.generateOtp);
//changeAdminpassword  updateAdminProfile  forgotPassword
adminRoutes.post("/changeAdminpassword",middleware.authentication,adminControllers.changeAdminpassword);
adminRoutes.post("/getAdminDetails",middleware.authentication,adminControllers.getAdminDetails);
adminRoutes.post("/updateAdminProfile",middleware.authentication,adminControllers.handleUpload,adminControllers.updateAdminProfile);
adminRoutes.post("/forgotPassword",adminControllers.forgotPassword);
adminRoutes.post("/validateOtp",adminControllers.validateOtp);
adminRoutes.post("/adminLogout",middleware.authentication,adminControllers.adminLogout);


//-------------------policies and terms conditions-------------------//
adminRoutes.post("/updateFaqs",middleware.authentication,adminControllers.updateFaqs);
adminRoutes.post("/deleteFaqs",middleware.authentication,adminControllers.deleteFaqs);
adminRoutes.post("/getFaqs",middleware.authentication,adminControllers.getFaqs);
adminRoutes.post("/getpolicies",adminControllers.getpolicies);
adminRoutes.post("/updatepolicies",middleware.authentication,adminControllers.updatepolicies);
adminRoutes.post("/contactUs",middleware.authentication,adminControllers.getContactDetails);
adminRoutes.post("/updateContactDetails",middleware.authentication,adminControllers.updateContactDetails);



//-----------------brands and category and  product routes----------------

adminRoutes.post("/updateBrand",middleware.authentication,brandsAndCategories.updateBrand);
adminRoutes.post("/getBrands",middleware.authentication,brandsAndCategories.getBrands);
adminRoutes.post("/deleteBrand",middleware.authentication,brandsAndCategories.deleteBrand);
adminRoutes.post("/updateCategory",middleware.authentication,brandsAndCategories.updateCategory);
adminRoutes.post("/getCategoriesByBrand",middleware.authentication,brandsAndCategories.getCategoriesByBrand);
adminRoutes.post("/getCategories",middleware.authentication,brandsAndCategories.getCategories);
adminRoutes.post("/deleteCategory",middleware.authentication,brandsAndCategories.deleteCategory);
adminRoutes.post("/updateProduct",middleware.authentication,brandsAndCategories.handleUpload
,brandsAndCategories.updateProducts);
adminRoutes.post("/getproducts",middleware.authentication,brandsAndCategories.getProducts);
adminRoutes.post("/getAllproducts",middleware.authentication,brandsAndCategories.getAllProducts);
adminRoutes.post("/getSingleProduct",middleware.authentication,brandsAndCategories.getProductById);
adminRoutes.post("/deleteProduct",middleware.authentication,brandsAndCategories.deleteProduct);


//---------------------Notifications---------------------


adminRoutes.post("/getNotifications",middleware.authentication,notifications.getNotifications);
adminRoutes.post("/sendNotifications",middleware.authentication,notifications.addNotification);
adminRoutes.post("/deleteNotification",middleware.authentication,notifications.deleteNotification);


//------------------------kyc approval---------------------------------//

adminRoutes.post("/getAllPendingKyc",middleware.authentication,kycControllers.getAllPendingKyc);
adminRoutes.post("/approveKyc",middleware.authentication,kycControllers.approveKyc);
adminRoutes.post("/changePromoterpasswordByAdmin",middleware.authentication,promoterRegistrastion.changePromoterpasswordByAdmin)
adminRoutes.post("/approveKycByPromoterId",middleware.authentication,kycControllers.approveKycByPromoterId);
adminRoutes.post("/rejectKyc",middleware.authentication,kycControllers.rejectKyc);


//-----------------------sales approval---------------//

adminRoutes.post("/getAllpendingSales",middleware.authentication,salesControllers.getAllpendingSales);
adminRoutes.post("/getAllSales",middleware.authentication,salesControllers.getAllSales);
adminRoutes.post("/ApproveSales",middleware.authentication,salesControllers.getApproveSales);
adminRoutes.post("/rejectSale",middleware.authentication,salesControllers.rejectSales)
adminRoutes.post("/getPromoterSales",middleware.authentication,salesControllers.getPromoterSales);
adminRoutes.post("/getPromoterPendingSales",middleware.authentication,salesControllers.getPromoterPendingSales);



//-----------------------wallet requests---------------//     walletApprovalwalletApproval
adminRoutes.post("/walletApproval",middleware.authentication,salesControllers.walletApproval);
adminRoutes.post("/walletRejection",middleware.authentication,salesControllers.walletRejection);
adminRoutes.post("/getPendingWalletRequests",middleware.authentication,salesControllers.getPendingWalletRequests);
adminRoutes.post("/getAllPendingWalletRequests",middleware.authentication,salesControllers.getAllPendingWalletRequests);
adminRoutes.post("/getAllRejectedWalletRequests",middleware.authentication,salesControllers.getRejectedWalletRequests);


//--------------------reports----------------------------------//

adminRoutes.post("/getAllPayments",middleware.authentication,reportControllers.getAllPayments);
//adminRoutes.post("/getAllSales",middleware.authentication,salesControllers.getAllSales);
adminRoutes.post("/getAllPromoters",middleware.authentication,reportControllers.getAllPromoters);


adminRoutes.post("/getPaymentReports",middleware.authentication,reportControllers.getPaymentReports);
adminRoutes.post("/getSaleReports",middleware.authentication,reportControllers.getSalesReports)
adminRoutes.post("/getSalesCount",middleware.authentication,reportControllers.getSalesCount)



//-----------------------------bulk upload-------------------------------------------//
adminRoutes.post("/bulkUploadProduct",middleware.authentication,
bulkUploadControllers.handleUpload,bulkUploadControllers.addBulkProducts);

adminRoutes.post("/getSingleSale",middleware.authentication,salesControllers.getSingleSale);



//----------------------------dashboardCount---------------------//
adminRoutes.post("/dashboardCount",middleware.authentication,reportControllers.dashboardCount);




//-----------------getProductBySquId--------------------//

adminRoutes.post("/getProductBySquId",middleware.authentication,brandsAndCategories.getProductBySquId);



//------------------------get kyc re-verification requests------------------//

adminRoutes.post("/getAllKyc_reverification_requests",
middleware.authentication,
kycControllers.getAllKyc_reverification_requests);

adminRoutes.post("/approve_kyc_reverification_req",
middleware.authentication,
kycControllers.approve_kyc_reverification_req);



adminRoutes.post(
    "/getAllQueries",
    middleware.authentication,
    queryControllers.getQueries

);

adminRoutes.post(
    "/setMonthTarget",
    middleware.authentication,
    queryControllers.setMonthTarget
)



//const { upload_bannerImg } = require("../../middleware/uploadImage");

// routes
adminRoutes.post(
  "/getbanners",
  middleware.authentication,
  bannercontroller.getBanners
);
adminRoutes.post(
  "/updateBanner",
  middleware.authentication,
 middleware.upload_bannerImg.single("image"),
  bannercontroller.updateBanner
);

adminRoutes.post(
    "/deleteBanner",
    middleware.authentication,
    bannercontroller.deleteBanner
  );










// routes
// adminRoutes.post(
//   "/registrationadmin",
//   verifyAdminToken,
//   uploadAvatar.none(),
//   admincontroller.adminRegistration
// );


module.exports = adminRoutes;