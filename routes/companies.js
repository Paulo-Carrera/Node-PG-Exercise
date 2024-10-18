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

router.get('/:code', async(req, res, next)=>{
    try{
        const { code } = req.params;
        const company = await db.query(`SELECT * FROM companies WHERE code = $1`, [code]);
        if(company.rows.length === 0){
            throw new expressError('Company not found', 404);
        }else{
            return res.json({ company : company.rows[0] });
        }
    }catch(e){
        next(e);
    }
});

router.post('/', async(req, res, next)=>{
    try{
        const { code, name, description } = req.body;
        const newCompany = await db.query(
            `INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) 
            RETURNING *`,
            [code, name, description]
        )
        return res.json({ company : newCompany.rows[0] });
    }catch(e){
        next(e);
    }
});

router.put('/:code', async(req, res, next)=>{
    try{
        const { code } = req.params;
        const { name, description } = req.body;
        const updateCompany = await db.query(
            `UPDATE companies SET name = $1, description = $2 WHERE code = $3 RETURNING *`,
            [name, description, code]
        )
        if(updateCompany.rows.length === 0){
            throw new expressError('Company not found', 404);
        }else{
            return res.json({ company : updateCompany.rows[0] });
        }
    }catch(e){
        next(e);
    }
});

router.delete('/:code', async(req, res, next)=>{
    try{
        const { code } = req.params;
        const deleteCompany = await db.query(
            `DELETE FROM companies WHERE code = $1 RETURNING *`,
            [code]
        )
        if(deleteCompany.rows.length === 0){
            throw new expressError('Company not found', 404);
        }else{
            return res.json({ status : 'deleted' })
        }
    }catch(e){
        next(e);
    }
});


module.exports = router;