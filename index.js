import mongoose from "mongoose";
import multer from "multer";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {
  CreateUniversity,
  DeleteUniversity,
  GetUniversities,
  UpdateUniversity,
} from "./controllers/University.js";
import {
  CreateDepartment,
  DeleteDepartment,
  GetDepartmentsByUniversityId,
  UpdateDepartment,
} from "./controllers/Department.js";
import {
  CreateProduct,
  DeleteProduct,
  GetProductDetails,
  GetProductsByDepartmentId,
  UpdateProduct,
  UpdateProductQty,
} from "./controllers/Product.js";
import { Login, Register } from "./controllers/User.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

//University Module
const storageUniv = multer.diskStorage({
  destination: "uploadsUniv/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});
const uploadUniv = multer({
  storage: storageUniv,
});

//http://localhost:8081/university

app.post("/university", uploadUniv.single("image"), CreateUniversity);
app.put("/university", uploadUniv.single("image"), UpdateUniversity);
app.delete("/university", DeleteUniversity);
app.get("/university", GetUniversities);

//Department Module
const storageDep = multer.diskStorage({
  destination: "uploadsDep/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});
const uploadDep = multer({
  storage: storageDep,
});

app.post("/department", uploadDep.single("image"), CreateDepartment);
app.put("/department", uploadDep.single("image"), UpdateDepartment);
app.delete("/department", DeleteDepartment);
app.get("/department", GetDepartmentsByUniversityId);

//Product Module
const storagePrd = multer.diskStorage({
  destination: "uploadsPrd/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});
const uploadPrd = multer({
  storage: storagePrd,
});

app.post("/product", uploadPrd.array("images"), CreateProduct);
app.put("/product", uploadPrd.array("images"), UpdateProduct);
app.delete("/product", DeleteProduct);
app.get("/product", GetProductsByDepartmentId);
app.get("/productDetails", GetProductDetails);
app.put("/updateProductQty", UpdateProductQty);

//User Module
app.post("/register", Register);
app.post("/login", Login);

//Images Access
app.use(express.static("uploadsUniv/"));
app.use(express.static("uploadsDep/"));
app.use(express.static("uploadsPrd/"));

mongoose
  .connect(process.env.DB_URL)
  .then((d) => {
    console.log("database connected");
    app.listen(process.env.PORT, () => {
      console.log("server running at port : " + process.env.PORT);
    });
  })
  .catch((e) => {
    console.log("database connection error");
  });
