const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

dotenv.config();

const sequelize = require("./config/db");
const User = require("./models/User");
const Consultation = require("./models/Consultation");

User.hasMany(Consultation, {
    foreignKey: "userId"
});

Consultation.belongsTo(User, {
    foreignKey: "userId"
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public", "pages")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authRoutes = require("./routes/authRoutes");
const consultationRoutes = require("./routes/consultationRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/consultation", consultationRoutes);

// Root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pages", "login.html"));
});

app.get("/login.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pages", "login.html"));
});

app.get("/register.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pages", "register.html"));
});

app.get("/dashboard.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pages", "dashboard.html"));
});

app.get("/add-consultation.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pages", "add-consultation.html"));
});

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
    .then(() => {
        console.log("MySQL Connected");
        console.log("Tables Created");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database Error:", error);
        process.exit(1);
    });
