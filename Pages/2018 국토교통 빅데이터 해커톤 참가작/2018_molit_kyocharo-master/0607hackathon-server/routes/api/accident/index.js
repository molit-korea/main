var router = require("express").Router(); 
var fs = require("fs");

router.get('/', (req, res) => { 
    const FILE_NAME = "frequencyAccident.json"
    const FILE_PATH = "data/" + FILE_NAME
    fs.readFile(FILE_PATH, 'utf-8', (err, data) => {
        if (err) throw err; 
        
        data = data.trim();

        res.json(JSON.parse(data));
    });

});

module.exports = router;
