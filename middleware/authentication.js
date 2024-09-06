exports.authentication=async (req,res,next)=>{
    try {
      console.log(req.url,"req")
        let expired = null;
        const bearerHeader = req.headers["authorization"];
        let bearerToken = "";
        if (bearerHeader) {
          bearerToken = bearerHeader.split(" ")[1];
        }
        // console.log(bearerToken)
        if (bearerToken!=undefined && bearerToken!=null && bearerToken!="") {
          jwt.verify(
            bearerToken,
            process.env.ADMIN_ACCESS_TOKEN_SECRET,
            function (err, decoded) {
              if (err) {
                try {
                  console.log(err);
                  expired = err;
                  res.status(400).json({
                    status: false,
                    message: "Your session has expired. Please login.",
                    expired,
                  });
                } catch (err) {
                  console.log(err);
                  res.status(400).json({
                    status: false,
                    message: "Your session has expired. Please login.",
                    // err,
                  });
                }
              }
    
              if (decoded) {
                req.userId = decoded.userId;
                // req.email = decoded.email;
                // req.phone = decoded.phone;
                // req.loginTime = decoded.iat;
                // console.log(req.userId);
                //iat: 1666000967,
                // exp: 1666087367
                console.log(decoded.userId)
                next();
              }
            }
          );
        } else {
          res
            .status(400)
            .json({ status: false, message: "Bearer token not defined" });
        }
      } catch (err) {
        console.log("eror", err);
        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
          return res
            .status(400)
            .json({ status: false, message: "Session Expired Error" });
        } else {
          res.status(400).json({ status: false, message: "Internal Server Error" });
        }
      }
};




const promoterImgStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./fileStorage/bannerImg");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const promoterImgMaxSize = 30 * 1024 * 1024;

exports.upload_bannerImg = multer({
  storage: promoterImgStorage,
  fileFilter: (req, file, cb) => {
    if (file.originalname.match(/\.(png|PNG|JPG|jpg|pdf|jpeg|JPEG|tiff|TIFF|gif|GIF|bmp|BMP|eps|EPS)$/)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("This file extension is not allowed"));
    }
  },
  limits: { fileSize: promoterImgMaxSize },
});