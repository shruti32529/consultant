const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
    addConsultation,
    getConsultations,
    deleteConsultation,
    updateConsultation
} = require("../controllers/consultationController");

const uploadRecording = (req, res, next) => {
    upload.single("recording")(req, res, (error) => {
        if (error) {
            return res.status(400).json({
                message: error.message
            });
        }

        next();
    });
};

router.post("/add", auth, uploadRecording, addConsultation);
router.get("/all", auth, getConsultations);
router.delete("/:id", auth, deleteConsultation);
router.put("/:id", auth, updateConsultation);

module.exports = router;
