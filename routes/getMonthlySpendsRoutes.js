const express = require("express");
const router = express.Router();
const {getMonthlySpendsController} = require("../controllers/getMonthlySpendsController");

router.get("/", getMonthlySpendsController);

module.exports = router;
