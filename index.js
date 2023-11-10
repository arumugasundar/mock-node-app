const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const { Liquid } = require('liquidjs');
const path = require('path');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended : true, limit: '100mb'}));
app.use(express.json({limit: '100mb'}));
app.use(cookieParser());

app.get('/', async (req, res) => {

    let query = req.query;
    let signature = query.signature;
    console.log('existing signature :', signature);
    delete query.signature;
    
    let formatted = Object.entries(query).map(([key, value]) => `${key}=${Array.isArray(value) ? value.join(',') : value}`).sort().join('');
    console.log('formatted uri :', formatted)

    let computedSignature = crypto.createHmac('sha256', process.env.SHOPIFY_APP_SECRET).update(formatted, 'utf-8').digest('hex')
    console.log('computer signature :', computedSignature);

    return res.status(200).send('under construction');

});

const PORT = 3500;

app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)});