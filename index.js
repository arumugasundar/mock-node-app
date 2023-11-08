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
app.use(express.static('ui/dist'));

const router = express.Router();

router.get('/',async (req, res) => {

    try {
        const engine = new Liquid();
        const liquidContent = fs.readFileSync('./content.liquid', 'utf-8');
        const indexPath = path.join(__dirname, 'ui', 'dist', 'index.html');
        const htmlContent = fs.readFileSync(indexPath, 'utf-8');

        const liquidContentWithHtml = liquidContent.replace(
            /{% render '\.\/ui\/dist\/index\.html' %}/g,
            htmlContent
        );
    
        const renderedContent = await engine.parseAndRender(liquidContentWithHtml);
        res.set({ 'Content-Type': 'application/liquid' });
        res.status(200).send(renderedContent);

    } catch (error) {
        console.log('error :', error)
        return res.status(500).json({ error: 'Failed to render Liquid content' });
    }

});

// router.get('/',async (req, res) => {

//     const liquidContent = fs.readFileSync('./content.liquid', 'utf-8');
//     const engine = new Liquid();

//     try {
//         const renderedContent = await engine.parseAndRender(liquidContent);
//         // res.set({ 'Content-Type': 'application/liquid' });
//         return res.status(200).send(renderedContent);
//     } catch (error) {
//         console.log('error :', error)
//         return res.status(500).json({ error: 'Failed to render Liquid content' });
//     }

// });

app.use('/', router);

// __dirname = path.resolve();
// app.use(express.static(path.join(__dirname,"/ui/dist")));

// app.get("*", (req,res) => {
//     const index = path.join(__dirname, '/ui/dist', 'index.html');
//     res.sendFile(index);
// });

const PORT = 80;
// const PORT = 3500;

app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)});