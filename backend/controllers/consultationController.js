const Consultation = require("../models/Consultation");

exports.addConsultation = async (req, res) => {
    try {
        const {
            clientName,
            phone,
            patientEmail,
            age,
            gender,
            address,
            consultationDate,
            notes,
            status,
            priority,
            followUpDate,
            diagnosis,
            prescription,
            fee,
            paymentStatus
        } = req.body;
        const recording = req.file ? req.file.filename : "";

        if (!clientName || !phone || !consultationDate) {
            return res.status(400).json({
                message: "Client name, phone, and date are required"
            });
        }

        const consultation = await Consultation.create({
            clientName,
            phone,
            patientEmail,
            age: age || null,
            gender: gender || "Not Specified",
            address,
            consultationDate,
            notes,
            status: status || "New",
            priority: priority || "Normal",
            followUpDate: followUpDate || null,
            diagnosis,
            prescription,
            fee: fee || 0,
            paymentStatus: paymentStatus || "Unpaid",
            recording,
            userId: req.user.id
        });

        res.json({
            message: "Consultation Added",
            consultation
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getConsultations = async (req, res) => {
    try {
        const consultations = await Consultation.findAll({
            where: { userId: req.user.id },
            order: [["createdAt", "DESC"]]
        });
        res.json(consultations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteConsultation = async (req, res) => {
    try {
        const deleted = await Consultation.destroy({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!deleted) {
            return res.status(404).json({ message: "Consultation not found" });
        }

        res.json({ message: "Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateConsultation = async (req, res) => {
    try {
        const allowedFields = [
            "clientName",
            "phone",
            "patientEmail",
            "age",
            "gender",
            "address",
            "consultationDate",
            "notes",
            "status",
            "priority",
            "followUpDate",
            "diagnosis",
            "prescription",
            "fee",
            "paymentStatus"
        ];
        const updates = {};

        allowedFields.forEach((field) => {
            if (Object.prototype.hasOwnProperty.call(req.body, field)) {
                updates[field] = req.body[field];
            }
        });

        const [updatedCount] = await Consultation.update(updates, {
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!updatedCount) {
            return res.status(404).json({ message: "Consultation not found" });
        }

        const updated = await Consultation.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
