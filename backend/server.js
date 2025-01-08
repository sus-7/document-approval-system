const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/user.routes");

const app = express();
app.use(cors());

const connectDB = require("./db/connection");
connectDB(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connection successfull!");
    })
    .catch(() => {
        console.log("MongoDB connection failed!!!!!");
    });

app.get("/", (req, res) => {
    console.log("new connection");
    res.send("welcome to document approval system");
});

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
