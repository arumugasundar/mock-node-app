const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const { Liquid } = require('liquidjs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended : true, limit: '100mb'}));
app.use(express.json({limit: '100mb'}));
app.use(cookieParser());

app.get('/', async (req, res) => {

    if(Object.entries(req.query).length > 0){
        
        const SHARED_SECRET = 'hush';

        let query = req.query;
        let signature = query.signature;
        delete query.signature;
        let sorted_params = Object.entries(query).map(([key, value]) => `${key}=${Array.isArray(value) ? value.join(',') : value}`).sort().join('');
        console.log('sorted params :', sorted_params);
        let calculated_signature = crypto.createHmac('sha256', SHARED_SECRET).update(sorted_params).digest('hex');
        console.log('calculated signature :', calculated_signature);

        if (signature !== calculated_signature) {
            return res.status(401).send('Invalid signature');
        } else {
            console.log('Signature is valid');
            const engine = new Liquid();
            const liquidContent = fs.readFileSync('./content.liquid', 'utf-8');
            const renderedContent = await engine.parseAndRender(liquidContent);
            res.set({ 'Content-Type': 'application/liquid' });
            return res.status(200).send(renderedContent);
        }

    } else {
        return res.status(400).send('Invalid request');
    }

    

});

const PORT = 3500;

app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)});