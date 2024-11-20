const express = require("express");
const router = express.Router();
const {getDailySpendsController} = require("../controllers/getDailySpendsController");

router.get("/", getDailySpendsController);

module.exports = router;
