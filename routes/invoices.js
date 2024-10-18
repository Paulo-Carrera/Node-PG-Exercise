const express = require('express');
const router = express.Router();
const expressError = require('../expressError');

const db = require('../db');

router.get('/', async(req, res, next)=>{
    try{
        const invoices = await db.query(`SELECT * FROM invoices ORDER BY id`);
        return res.json({ invoices : invoices.rows });
    }catch(e){
        next(e);
    }
});

router.get('/:id', async(req, res, next)=>{
    try{
        const { id } = req.params;
        const invoice = await db.query(`SELECT * FROM invoices WHERE id = $1`, [id]);
        if(invoice.rows.length === 0){
            throw new expressError('Invoice not found', 404);
        }else{
            return res.json({ invoice : invoice.rows[0] });
        }
    }catch(e){
        next(e);
    }
});

router.post('/', async(req, res, next)=>{
    try{
        const { comp_code, amt } = req.body;
        const newInvoice = await db.query(
            `INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *`,
            [comp_code, amt]
        )
        return res.json({ invoice : newInvoice.rows[0] });
    }catch(e){
        next(e);
    }
});

router.put('/:id', async(req, res, next)=>{
    try{
        const { id } = req.params;
        const { comp_code, amt } = req.body;
        const updateInvoice = await db.query(
            `UPDATE invoices SET comp_code = $1, amt = $2 WHERE id = $3 RETURNING *`,
            [comp_code, amt, id]
        )
        return res.json({ invoice : updateInvoice.rows[0] });
    }catch(e){
        next(e);
    }
});

router.delete('/:id', async(req, res, next)=>{
    try{
        const { id } = req.params;
        const deleteInvoice = await db.query(
            `DELETE FROM invoices WHERE id = $1 RETURNING *`,
            [id]
        )
        return res.json({ status : 'deleted' });
    }catch(e){
        next(e);
    }
});

router.get('/companies/:code', async(req, res, next)=>{
    try{
        const { code } = req.params;
        const invoices = await db.query(`SELECT * FROM invoices WHERE comp_code = $1`, [code]);
        return res.json({ invoices : invoices.rows });
    }catch(e){
        next(e)
    }
});

module.exports = router ;