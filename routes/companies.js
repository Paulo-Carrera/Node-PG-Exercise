const express = require('express');
const router = new express.Router();
const expressError = require('../expressError');

const db = require('../db');

router.get('/', async(req, res, next)=>{
    try{
        const companies = await db.query(`SELECT * FROM companies ORDER BY name`);
        return res.json({ companies : companies.rows });
    }catch(e){
        next(e);
    }
});



module.exports = router;