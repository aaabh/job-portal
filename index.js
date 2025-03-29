import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./router/user.router.js";
import companyRoute from "./router/company.route.js";
import jobRoute from "./router/job.router.js";
const app = express();
dotenv.config();

//̥̥̥̥̥̥̥middleware 
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
const corsOptions ={
  origin: ["http://localhost:5121"],
  Credentials: true,
};

app.use(cors(corsOptions));


const PORT = process.env.PORT || 5001;

//api's
app.use("/api/users", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/job", jobRoute);


app.listen(PORT ,() =>{
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
