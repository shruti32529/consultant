const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Consultation = sequelize.define("Consultation", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    clientName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    patientEmail: {
        type: DataTypes.STRING
    },
    age: {
        type: DataTypes.INTEGER
    },
    gender: {
        type: DataTypes.ENUM("Not Specified", "Male", "Female", "Other"),
        defaultValue: "Not Specified"
    },
    address: {
        type: DataTypes.TEXT
    },
    consultationDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    recording: {
        type: DataTypes.STRING
    },
    notes: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.ENUM("New", "In Progress", "Completed"),
        defaultValue: "New"
    },
    priority: {
        type: DataTypes.ENUM("Normal", "High", "Urgent"),
        defaultValue: "Normal"
    },
    followUpDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    diagnosis: {
        type: DataTypes.TEXT
    },
    prescription: {
        type: DataTypes.TEXT
    },
    fee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    paymentStatus: {
        type: DataTypes.ENUM("Unpaid", "Partial", "Paid"),
        defaultValue: "Unpaid"
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});

module.exports = Consultation;
