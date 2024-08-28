import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import multer from "multer";
import { fileURLToPath } from "url";

// Routes
import AuthRouter from "./routes/auth.routes.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;

app.use(
  cors({
    origin: "https://multer-deploy-frontend.vercel.app",
    credentials: true,
  })
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./ProfilePictures");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Get __filename and __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());
// app.use(
//   "/ProfilePictures",
//   express.static(path.join(__dirname, "ProfilePictures"))
// );
app.use(express.static("./"));

app.use("/api/auth", upload.single("uploadedPicture"), AuthRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("Database connection established");
  })
  .catch((err) => {
    console.log(err);
  });
