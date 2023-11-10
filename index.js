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
    console.log('signature :', signature);
    delete query.signature;

    let original = "extra=1&extra=2&shop=shop-name.myshopify.com&path_prefix=%2Fapps%2Fawesome_reviews&timestamp=1317327555&signature=f21b923e9e24befdafcb649dbb408b2dfd357c9ecbf49f791135b0aed10984f1";
    let formatted = original.replace(/&signature=[^&]*/, "").split("&").sort().join("")
    let formatted1 = Object.entries(query).map(([key, value]) => `${key}=${Array.isArray(value) ? value.join(',') : value}`).sort().join('');
    console.log('formatted :', formatted)
    console.log('formatted 1 :', formatted1)
    let computedSignature = crypto.createHmac('sha256', process.env.SHOPIFY_APP_SECRET).update(formatted1, 'utf-8').digest('hex')
    console.log('computer signature :', computedSignature);

    return res.status(200).send('under construction');

    // if(Object.entries(req.query).length > 0){

    // } else {
    //     return res.status(400).send('Invalid request');
    // }
});

const PORT = 80;

app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)});