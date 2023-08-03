const express = require('express');
const app = express();

const path = require('path');
const PORT = process.env.PORT || 3300;

/*app.use('/', express.static(path.join(__dirname, 'public')));*/

app.get('^/$|/index(.html)?', (req,res) => {
    res.sendFile(path.join(__dirname,'views','index.html'));
});
app.get('/new-page(.html)?', (req,res) => {
    res.sendFile(path.join(__dirname,'views','new-page.html'));
});
app.get('/old-page(.html)?', (req,res) => {
    res.redirect(301, '/new-page');
});

//Route handlers (They work like the middleware)
app.get('/hello(.html)?', (req,res,next) => {
    console.log('Attempting to load hello.html');
    next()
}, (req, res) => {
    res.send('Hello World!!')
});

//Chaining route handlers (They work like the middleware)
const first = (req, res, next) => {
    console.log('First chain!!');
    next();
};
const second = (req, res, next) => {
    console.log('Second chain!!');
    next();
};
const third = (req, res, next) => {
    console.log('Third chain!!');
    res.send('Chaining finished!!');
};
app.get('/chain(.html)?', [first,second,third]);

app.get('/*', (req,res) => {
    res.status(404).sendFile(path.join(__dirname,'views', '404.html'));
});

app.listen(PORT, () => console.log(`Listening to http:\\localhost:${PORT}`));