const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const { Liquid } = require('liquidjs');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended : true, limit: '100mb'}));
app.use(express.json({limit: '100mb'}));
app.use(cookieParser());

const router = express.Router();

router.get('/',async (req, res) => {

    const liquidContent = fs.readFileSync('./content.liquid', 'utf-8');
    const engine = new Liquid();

    try {
        const renderedContent = await engine.parseAndRender(liquidContent);
        return res.status(200).send(renderedContent);
    } catch (error) {
        console.log('error :', error)
        return res.status(500).json({ error: 'Failed to render Liquid content' });
    }

});

app.use('/', router);

const PORT = 80;

app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)});