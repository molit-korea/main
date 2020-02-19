var router = require("express").Router(); 

const DATA_DIR = "data/";
const csv = require('csvtojson');

router.get('/:id', (req, res) => { 

    const { id } = req.params;



    csv({
        noheader: true,
        output: "csv"
    })
        .fromFile(DATA_DIR +"dtg-danger/"+ id)
        .then((result) => {
            res.json(result)
        })
        .catch(err =>
        res.status(500).send(err));

});

router.get('/list/:id', (req, res) => {
    const id = parseInt(req.params.id); 

    if (id < 1 || id > 150) {
        res.status(406).send("PARAM-ERROR"); 
    }
    else {
    csv({
        noheader: true,
        output: "csv"
    })
        .fromFile(DATA_DIR + "dtg-list.csv")
        .then((result) => {
            // console.log(result[0].slice(100 * (id - 1), 100 * id).length)
            res.json(result[0].slice(150 * (id - 1), 150 * id))
        })
        .catch(err =>
        res.status(500).send(err)); 
    } 
});

module.exports = router;
