"use strict";

// libraries
const XLSX = require("xlsx");
const { DateTime } = require("luxon");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// models
const Admin = require("../../models/admin");
const Brand = require("../../models/brands");
const Category = require("../../models/categories");
const Product = require("../../models/products");

// add bulk Products
exports.addBulkProducts = async function (req, res) {
  try {
    console.log(req.files)
    const admin = await Admin.findOne({ _id: req.userId }, { _id: 1, name: 1 });
    const istDateTime = DateTime.now().setZone("Asia/Kolkata");
    const logDate = istDateTime.toISO({ includeOffset: true });

    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets["Sheet1"];
    const headers = {};
    const data = [];
    // Loop through each cell in the worksheet
    for (const cell in worksheet) {
      const cellRef = XLSX.utils.decode_cell(cell);
      const cellValue = worksheet[cell]?.v;
      // If the current cell is in the first row (header row)
      if (cellRef.r === 0 && cellValue) {
        // Remove hyphens and spaces from the header name
        const headerName = cellValue.replace(/[- ]/g, "");
        headers[cellRef.c] = headerName;
      }
      // Otherwise, the current cell is a data cell
      else if (cellValue !== undefined) {
        // Initialize the current row in the data array if it doesn't exist yet
        if (!data[cellRef.r]) {
          data[cellRef.r] = {};
        }
        // Get the header name for the current column, replacing hyphens and spaces
        const headerName =
          headers[cellRef.c]?.replace(/[- ]/g, "") || `Column${cellRef.c}`;
        // Add the cell value to the data object using the header name as the property key
        data[cellRef.r][headerName] = cellValue;
      }
    }
    // Remove any empty rows from the data array
    const newData = data.filter(Boolean);

    const productsArr = [];
    await Promise.all(
      newData.map(async function (key) {
        let brandId = null;
        let categoryId = null;

        // brand data { $regex: new RegExp(req.body.title, "i") }
        // const brand_name =
        const brandName = key.BrandName.trim().toUpperCase();
        const brand = await Brand.findOne({
          name: { $regex: new RegExp(brandName, "i") },
        });
        if (!brand) {
          const brandObj = await Brand.create({
            name: brandName,
            description: "New Brand Created While Bulk Upload",
            logCreatedDate: logDate,
            logModifiedDate: logDate,
          });

          brandId = brandObj._id;
        } else {
          brandId = brand._id;
        }

        // category data
        const categName = key.Category.trim().toUpperCase();
        const categ = await Category.findOne({
          name: { $regex: new RegExp(categName, "i") },
        });
        console.log(categ,"catt")
        if (!categ) {
            console.log(12222)
          const categObj = await Category.create({
            name: categName,
            description: "New Category Created While Bulk Upload",
            logCreatedDate: logDate,
            logModifiedDate: logDate,
          });
          console.log(13333333333)

          categoryId = categObj._id;
        } else {
          categoryId = categ._id;
        }

        // product data
        const product = key.Product.trim().toUpperCase();
        const productsdata = await Product.findOne({
          brand_id: brandId,
          category_id: categoryId,
          name: { $regex: new RegExp(product, "i") },
        });
        if (productsdata)
          return console.log(
            `${brandName}, ${categName}, ${product} already exists`
          );
          console.log(product,"prodddd")
        let obj = {
          brand_id: brandId,
          brandName: brandName,
          category_id: categoryId,
          categoryName: categName,
          name: product,
          incentive: key.Incentive,
          serialNumber: key.SerialNumber,
          EANcode:key.EANcode,
          SKUid:key.SKUid,
          description: "New Product add While Bulk Upload",
          price: key.Price,
          logCreatedDate: logDate,
          logModifiedDate: logDate,
        };
        return productsArr.push(obj);
      })
    );
    const saveProducts = await Product.insertMany(productsArr);
    if (saveProducts) {
      return res.status(200).json({
        success: true,
        message: "Successfully added to the product list",
      });
    } else {
      return res.status(400).json({ success: false, message: "Bad request" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

const bulkMiddleware = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "./fileStorage/bulk_uploads");
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/\.(csv|xlsx)$/)) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("This file extension is not allowed"));
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  });

  exports.handleUpload = (req, res, next) => {
    bulkMiddleware.single("products")(req, res, err => {
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