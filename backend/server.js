const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/user.routes");

const app = express();
const corsOptions = {
    origin: ["http://localhost:5174", "http://localhost:5173"],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const connectDB = require("./db/connection");

connectDB(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connection successfull!");
    })
    .catch((error) => {
        console.log("server service :: connectDB :: error : ", error);
        console.log("MongoDB connection failed!!!!!");
    });

app.get("/", (req, res) => {
    console.log("new connection");
    res.send("welcome to document approval system");
});

app.use("/user", userRoutes);
// app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

/*


const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Ready for messages");
        console.log(success);
    }
});




app.get("/sendMail", (req, res) => {
    const to = "shreyasgalgale019@gmail.com";
    const subject = "Test Email";
    const text = "Hello World!";
    const html = "<b>Hello World!</b>";
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to,
        subject,
        text,
        html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
});

*/
