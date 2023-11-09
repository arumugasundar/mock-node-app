const express = require('express');
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

app.use('/assets', (req, res) => {

    console.log('requested url :', req.url);
    const fileExtension = path.extname(req.url);
    if (fileExtension === '.css') {
        res.setHeader('Content-Type', 'text/css');
    } else if(fileExtension === '.js'){
        res.setHeader('Content-Type', 'text/javascript');
    } else if (fileExtension === '.svg') {
        res.setHeader('Content-Type', 'image/svg+xml');
    }
    const file = path.join(__dirname, 'ui/dist/assets', req.url);
    console.log('file to be shared :', file);

    return res.sendFile(file);
});

app.get('/', async (req, res) => {

    const engine = new Liquid();
    const liquidContent = fs.readFileSync('./content.liquid', 'utf-8');
    let response = null;
    try {
        response = await fetch("https://qa-eshipz.herokuapp.com/track-widget/5343662b-5b86-4ea0-abb6-33d4a4b37f5c/liquid", {
            method: 'GET',
            redirect: 'follow'
          });
        response = await response.text();
    } catch (error) {
        console.log('error :', error);
    }


    const renderedContent = await engine.parseAndRender(response ?? '');
    res.set({ 'Content-Type': 'application/liquid' });
    return res.status(200).send(renderedContent);

});

const PORT = 80;

app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)});