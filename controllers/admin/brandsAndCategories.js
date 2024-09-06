const Brand=require("../../models/brands");
const Category=require("../../models/categories");
const Product=require("../../models/products");

exports.updateBrand=async (req,res)=>{
    const brand_id= req.body.brand_id;
    const brand_name=(req.body.brand_name);
    const description=req.body.description;
    const istDateTime = DateTime.now().setZone("Asia/Kolkata");
    // console.log(istDateTime)      
     const logDate = istDateTime.toISO({ includeOffset: true });
    try{
    if(brand_id){
        const updated_brand=await Brand.findOneAndUpdate(
            {_id: brand_id},
            {name: brand_name,
             logModifiedDate:logDate
            },
            {new:true});
        if(updated_brand){
            res.status(200).json({
                message: " Brand updated successfully",
                data:updated_brand
              });
        }else{
            res.status(400).json({
                message: "please try again",
              });
        }
    }else{
        const added_brand=await Brand.create(
        {name:brand_name, 
        description:description,
        logCreatedDate:logDate
        })
        if(added_brand){
            res.status(200).json({
                message: " Brand  added successfully",
                added_brand:added_brand
              });
        }else{
            res.status(400).json({
                message: "please try again",
              });
        }

    }
}
    catch (err) {console.log(err.message,typeof err.message)
        console.log(err.message.includes("duplicate"));
        if(err.message.includes("duplicate")){
            return res.status(400).json({ message: "this brand already exists"});
        }else{
        return res.status(400).json({ message: err.message ?? "Bad request" });
        }
      }
}

exports.getBrands = async function (req, res) {
  let condition={};
  let regex = new RegExp(req.query.searchQuery, "i");
  if (req.query.searchQuery !== "") {
    condition = {
      $or: [{ name:regex  }],
    };
  }
    try {
      const istDateTime = DateTime.now().setZone("Asia/Kolkata");
      const logDate = istDateTime.toISO({ includeOffset: true });
     
  
      const brands = await Brand.find(condition);
     
  
      if (!brands) {
          return res.status(200).json({
            message: "no brands present",
            brands: brands ?? {},
          });
        //}
      } else {
        return res.status(200).json({
          message: "Successfull ",
          brands: brands ?? {},
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: err.message ?? "Bad request" });
    }
  };

  exports.deleteBrand=async (req,res)=>{
    const brand_id=req.body.brand_id;
    try {
        const istDateTime = DateTime.now().setZone("Asia/Kolkata");
        const logDate = istDateTime.toISO({ includeOffset: true });
    
       // const brands = await Brand.find({});
       const deleted_brand=await Brand.deleteMany({ _id: { $in: brand_id } })
    
        if (deleted_brand.deletedCount<1) {
            return res.status(200).json({
              message: "please try again",
              deleted_brand: deleted_brand ?? {},
            });
          //}
        } else {
          return res.status(200).json({
            message: "Successfull ",
            deleted_brand: deleted_brand ?? {},
          });
        }
      } catch (err) {
        console.log(err);
        return res.status(400).json({ message: err.message ?? "Bad request" });
      }

  };

  exports.updateCategory = async (req, res) => {
    const { category_name, category_id, description, brand_id } = req.body;
    const istDateTime = DateTime.now().setZone("Asia/Kolkata");
    const logDate = istDateTime.toISO({ includeOffset: true });
  
    try {
      if (category_id) {
        // Find the existing category
        const category = await Category.findById(category_id);
  
        if (!category) {
          return res.status(404).json({ message: "Category not found" });
        }
  
        // Convert the existing brand_id to an array if it's not already an array
        if (!Array.isArray(category.brand_id)) {
          category.brand_id = [category.brand_id];
        }
  
        // If `brand_id` is provided in the request, append it to the existing array
        let update = {
          name: category_name,
          description: description,
          logModifiedDate: logDate,
        };
  
        if (brand_id && Array.isArray(brand_id) && brand_id.length > 0) {
          update['$push'] = { brand_id: { $each: brand_id } };
        }
  
        // Update the category
        const updated_category = await Category.findOneAndUpdate(
          { _id: category_id },
          update,
          { new: true }
        );
  
        if (updated_category) {
          return res.status(200).json({
            message: "Category updated successfully",
            data: updated_category,
          });
        } else {
          return res.status(400).json({ message: "Failed to update category" });
        }
      } else {
        return res.status(400).json({ message: "Category ID is required" });
      }
    } catch (err) {
      console.log(err.message);
      return res.status(400).json({ message: err.message ?? "Bad request" });
    }
  };
  

//   exports.updateCategory=async (req,res)=>{
//     // const brand_id=req.body.brand_id;
//     // const brand_name=req.body.brand_name;
//     const category_name=req.body.category_name;
//     const category_id=req.body.category_id
//     const description=req.body.description;
//     const istDateTime = DateTime.now().setZone("Asia/Kolkata");
//     // console.log(istDateTime)      
//      const logDate = istDateTime.toISO({ includeOffset: true });
//     try{
//     if(category_id){
//         const updated_category=await Category.findOneAndUpdate(
//             {_id: category_id},
//             {name: category_name,
//                 brand_id:brand_id,
//                 brand_name:brand_name, 
//              logModifiedDate:logDate
//             },
//             {new:true});
//         if(updated_category){
//             res.status(200).json({
//                 message: " category updated successfully",
//                 data:updated_category
//               });
//         }else{
//             res.status(400).json({
//                 message: "please try again",
//               });
//         }
//     }else{
//         const added_category=await Category.create(
//         {
//         name:category_name,
//         brand_id:brand_id,
//         brand_name:brand_name, 
//         description:description,
//         logCreatedDate:logDate
//         })
//         if(added_category){
//             res.status(200).json({
//                 message: " category  added successfully",
//                 added_category
//               });
//         }else{
//             res.status(400).json({
//                 message: "please try again",
//               });
//         }

//     }
// }
//     catch (err) {console.log(err.message,typeof err.message)
//         console.log(err.message.includes("duplicate"));
//         if(err.message.includes("duplicate")){
//             return res.status(400).json({ message: "this category already exists"});
//         }else{
//         return res.status(400).json({ message: err.message ?? "Bad request" });
//         }
//       }
//   }

  exports.getCategories = async (req, res) => {
    const brand_id = req.body.brand_id;

    try {
        // Fetch categories related to the specific brand
        const categories = await Category.find({ brand_id: brand_id });

        if (!categories || categories.length === 0) {
            return res.status(200).json({
                message: "No categories found for this brand",
                categories: []
            });
        } else {
            return res.status(200).json({
                message: "Successful",
                categories: categories
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: err.message || "Bad request" });
    }
};



// exports.getCategories = async (req, res) => {
//   const brand_id = req.query.brand_id; // Retrieve brand_id from query parameters
//   let condition = {};
//   let regex = new RegExp(req.query.searchQuery, "i");

//   if (req.query.searchQuery && req.query.searchQuery.trim() !== "") {
//       condition = {
//           name: regex
//       };
//   }

//   try {
//       const istDateTime = DateTime.now().setZone("Asia/Kolkata");
//       const logDate = istDateTime.toISO({ includeOffset: true });

//       // Log the conditions and parameters for debugging
//       console.log(`Fetching categories with brand_id: ${brand_id} and searchQuery: ${req.query.searchQuery}`);

//       // Filter categories based on the brand_id and search query
//       const categories = await Category.aggregate([
//           {
//               $match: {
//                   ...condition,
//                   brand_id: new mongoose.Types.ObjectId(brand_id) // Filter by brand_id
//               }
//           },
//           {
//               $sort: {
//                   name: 1 // Sort categories by name or any other field
//               }
//           }
//       ]);

//       // Log the result for debugging
//       console.log('Categories found:', categories);

//       if (categories.length === 0) {
//           return res.status(200).json({
//               message: "No categories present",
//               categories: categories
//           });
//       } else {
//           return res.status(200).json({
//               message: "Successful",
//               categories: categories
//           });
//       }
//   } catch (err) {
//       console.log(err);
//       return res.status(400).json({ message: err.message ?? "Bad request" });
//   }
// }





exports.getCategoriesByBrand = async (req, res) => {
  let condition = {};

  // Create a regular expression for searchQuery if provided
  let regex = new RegExp(req.query.searchQuery, "i");
  
  // Check for searchQuery and add to condition
  if (req.query.searchQuery && req.query.searchQuery !== "") {
    condition = {
      $or: [{ name: regex }],
    };
  }
  
  // Check for brand_id and add to condition
  if (req.query.brand_id) {
    condition.brand_id = req.query.brand_id;
  }

  try {
    const istDateTime = DateTime.now().setZone("Asia/Kolkata");
    const logDate = istDateTime.toISO({ includeOffset: true });

    // Find categories based on the condition
    const categories = await Category.find(condition);

    if (!categories || categories.length === 0) {
      return res.status(200).json({
        message: "No categories present",
        categories: [],
      });
    } else {
      return res.status(200).json({
        message: "Successful",
        categories: categories,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message || "Bad request" });
  }
};


exports.deleteCategory=async (req,res)=>{
    const category_id=req.body.category_id;
    try {
        const istDateTime = DateTime.now().setZone("Asia/Kolkata");
        const logDate = istDateTime.toISO({ includeOffset: true });
    
       // const brands = await Brand.find({});
       const deleted_category=await Category.deleteMany({ _id: { $in: category_id } })
    
        if (deleted_category.deletedCount<1) {
            return res.status(200).json({
              message: "please try again",
              deleted_category: deleted_category ?? {},
            });
          //}
        } else {
          return res.status(200).json({
            message: "Successfull ",
            deleted_category: deleted_category ?? {},
          });
        }
      } catch (err) {
        console.log(err);
        return res.status(400).json({ message: err.message ?? "Bad request" });
      }

  };

  exports.updateProducts=async (req,res)=>{
    const product_id=req.body.product_id;
    const product_name=req.body.product_name;
    const price=req.body.price;
    const serial_number=req.body.serialNumber;
    const brand_id=req.body.brand_id;
    const brand_name=req.body.brand_name;
    const category_name=req.body.category_name;
    const category_id=req.body.category_id
    const description=req.body.description;
    const incentive= req.body.incentive;
    const EANcode= req.body.EANcode;
    const SKUid=req.body.SKUid;
    const istDateTime = DateTime.now().setZone("Asia/Kolkata");
    // console.log(istDateTime)      
     const logDate = istDateTime.toISO({ includeOffset: true });
     //console.log(req.file.path,req.files=={})
     console.log(serial_number)
    try{
    if(product_id){
        const updated_product=await Product.findOneAndUpdate(
            {_id: product_id},
            {
                name:product_name || console.log("no product_name update"),
                incentive:incentive || console.log("no incentive update"),
                serialNumber:serial_number || console.log("no serial_number update"),
                category_id:category_id  || console.log("no category_id update"),
                category_name:category_name || console.log("no category_name update"),
                brand_id:brand_id  || console.log("no brand_id update"),
                brand_name:brand_name  || console.log("no brand_name update"), 
                description:description || console.log("no description update"),
                price:price  || console.log("no price update"),
                EANcode:EANcode  || console.log("no EANcode update"),
                 SKUid:SKUid   || console.log("no image update"),
                path:req.file? req.file.path:console.log("no SKUid update"),
                logModifiedDate:logDate || console.log("no image update"),
            },
            {new:true});
       

        if(updated_product){
            res.status(200).json({
                message: "product updated successfully",
                data:updated_product
              });
        }else{
            res.status(400).json({
                message: "please try again",
              });
        }
    }else{
        const added_product=await Product.create(
        {
        name:product_name,
        incentive:incentive,
        serialNumber:serial_number,
        category_id:category_id,
        category_name:category_name,
        brand_id:brand_id,
        brand_name:brand_name,
        price:price, 
        description:description,
        EANcode:EANcode,
        SKUid:SKUid,
        logCreatedDate:logDate,
        logModifiedDate:logDate
        })
        if(added_product){
            res.status(200).json({
                message: "product  added successfully",
                added_product
              });
        }else{
            res.status(400).json({
                message: "please try again",
              });
        }

    }
}
    catch (err) {
    console.log(err.message,typeof err.message)
        console.log(err.message.includes("duplicate"));
        if(err.message.includes("duplicate")){
            return res.status(400).json({ message: "this product already exists"});
        }else{
        return res.status(400).json({ message: err.message ?? "Bad request" });
        }
      }
  }


  exports.getProducts=async (req,res)=>{

    const brand_id=req.body.brand_id;
    const category_id=req.body.category_id;

    try {
        const istDateTime = DateTime.now().setZone("Asia/Kolkata");
        const logDate = istDateTime.toISO({ includeOffset: true });
    
        const products2 = await Product.find({brand_id:brand_id,category_id:category_id});

        const products=await Product.aggregate([
          {
            $match: {
             brand_id:new mongoose.Types.ObjectId(brand_id),
             category_id:new mongoose.Types.ObjectId(category_id)
            }
          },
          {
            $sort:
              {
                logCreatedDate: -1
              }
            
          },
          {
            $lookup: {
              from: "brands",
                localField: "brand_id",
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
              localField: "category_id",
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
              
            }},
           
          {
            $project: {
             
              "brand": 0,
              "category": 0,
              
            }
          },
          {
            $sort: { logCreatedDate: 1 }
          }
        ])
  // console.log(products)
        if (!products) {
            return res.status(200).json({
              message: "no categories present",
              products: products ?? {},
            });
          //}
        } else {
          return res.status(200).json({
            message: "Successfull ",
            products: products ?? {},
          });
        }
      } catch (err) {
        console.log(err);
        return res.status(400).json({ message: err.message ?? "Bad request" });
      }
}


exports.getProductBySquId= async (req,res)=>{

  const squId=req.body.squId;
  const EANcode=req.body.EANcode;

  try {
      const istDateTime = DateTime.now().setZone("Asia/Kolkata");
      const logDate = istDateTime.toISO({ includeOffset: true });
  
     // const products2 = await Product.find({squId:squId});
      const products=await Product.aggregate([
        {
          $match: {
            EANcode:EANcode
           
          }
        },
        {
          $lookup: {
            from: "brands",
              localField: "brand_id",
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
            localField: "category_id",
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
            
          }},
         
        {
          $project: {
           
            "brand": 0,
            "category": 0,
            
          }
        }
      ])
  console.log(products)
      if (!products || (products.length<1)) {
          return res.status(400).json({
            message: "no product present",
            products: products ?? {},
          });
        //}
      } else {
        return res.status(200).json({
          message: "Successfull ",
          products: products ?? {},
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: err.message ?? "Bad request" });
    }


}


exports.getAllProducts=async (req,res)=>{


    try {
        const istDateTime = DateTime.now().setZone("Asia/Kolkata");
        const logDate = istDateTime.toISO({ includeOffset: true });

        let condition={};
  let regex = new RegExp(req.query.searchQuery, "i");
  if (req.query.searchQuery !== "") {
    condition = {
      $or: [{ name:regex  },{EANcode:regex},{SKUid:regex
      }],
    };
  }
    
        
        const products=await Product.aggregate([
          {
            $match:condition
          },
         
          {
            $lookup: {
              from: "brands",
                localField: "brand_id",
                foreignField: "_id",
                as: "brand"
            }
          },
          {
            $unwind: {
              path:"$brand",
            preserveNullAndEmptyArrays: true }// Since $lookup returns an array, we unwind to destructure it
          },
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category"
            }
          },
          {
            $unwind: {
              path:"$category",
            preserveNullAndEmptyArrays: true }// Again, we unwind to destructure the product array
          },
          {
            $addFields: {
              brandName: "$brand.name",
              categoryName: "$category.name",
              
            }},
           
          {
            $project: {
             
              "brand": 0,
              "category": 0,
              
            }
          },
          {
            $sort:
              {
                logCreatedDate: -1
              }
            
          },
        ])
        
        
    console.log(products)
        if (!products) {
            return res.status(200).json({
              message: "no products",
              products: products ?? [],
              count:products.length
            });
          //}
        } else {
          return res.status(200).json({
            message: "Successfull ",
            products: products ?? [],
            count:products.length
          });
        }
      } catch (err) {
        console.log(err);
        return res.status(400).json({ message: err.message ?? "Bad request" });
      }
}


exports.getProductById=async (req,res)=>{

   
    const product_id=req.body.product_id

    try {
        const istDateTime = DateTime.now().setZone("Asia/Kolkata");
        const logDate = istDateTime.toISO({ includeOffset: true });
    
        const products2 = await Product.find({_id:product_id});
        const products=await Product.aggregate([
          {
            $match: {
             _id:new mongoose.Types.ObjectId(product_id),
             
            }
          },
          {
            $lookup: {
              from: "brands",
                localField: "brand_id",
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
              localField: "category_id",
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
              
            }},
           
          {
            $project: {
             
              "brand": 0,
              "category": 0,
              
            }
          }
        ])
   // console.log(categories)
        if (!products) {
            return res.status(200).json({
              message: "no categories present",
              products: products ?? {},
            });
          //}
        } else {
          return res.status(200).json({
            message: "Successfull ",
            products: products ?? {},
          });
        }
      } catch (err) {
        console.log(err);
        return res.status(400).json({ message: err.message ?? "Bad request" });
      }
}

exports.deleteProduct=async (req,res)=>{
    const product_id=req.body.product_id;
    try {
        const istDateTime = DateTime.now().setZone("Asia/Kolkata");
        const logDate = istDateTime.toISO({ includeOffset: true });
    
       // const brands = await Brand.find({});
       const deleted_product=await Product.deleteMany({ _id: { $in: product_id } })
    
        if (deleted_product.deletedCount<1) {
            return res.status(200).json({
              message: "please try again",
              deleted_product: deleted_product ?? {},
            });
          //}
        } else {
          return res.status(200).json({
            message: "Successfull ",
            deleted_product: deleted_product ?? {},
          });
        }
      } catch (err) {
        console.log(err);
        return res.status(400).json({ message: err.message ?? "Bad request" });
      }

  };



  const doctorImgStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./fileStorage/product_images");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  const doctorImgMaxSize = 30 * 1024 * 1024;
  const upload_productImg = multer({
    storage: doctorImgStorage,
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/\.(png|PNG|jpg|pdf)$/)) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("This file extension is not allowed"));
      }
    },
    limits: { fileSize: doctorImgMaxSize },
  });


  exports.handleUpload = (req, res, next) => {
    upload_productImg.single("product_image")(req, res, err => {
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