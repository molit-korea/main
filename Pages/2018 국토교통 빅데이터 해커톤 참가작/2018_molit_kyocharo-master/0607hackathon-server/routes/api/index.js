var router = require("express").Router(); 

var dangerIndex = require("./danger");
var accidentIndex = require("./accident");

router.use('/danger', dangerIndex);
router.use('/accident', accidentIndex);

module.exports = router;
