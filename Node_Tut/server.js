const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3300;

// custom middleware logger
// esta chamada se refere ao javascript para criação do log de eventos
app.use(logger);

// Cross Origin Resource Sharing
// Utilize o CORS para restringir os sites que podem acessar o seu back-end
// Crie uma White List de links aceitos e a configure dentro do corsOptions
const whitelist = ['https://www.google.com','http://127.0.0.1:5500','http://localhost:3300'];
const corsOptions = {
    origin: (origin, callback) => {
        if ((whitelist.indexOf(origin) !== -1) || (!origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));


// built-in middleware to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({extended: false}));

// built-in middleware for json
app.use(express.json());

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));


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

app.all('*', (req,res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname,'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: "404 Not Found" });
    } else {
        res.type('txt').send("404 Not found");
    }
});

// cria um chamado para o caso de erro
// com isso, o erro é apresentado no navegador
app.use(errorHandler);

app.listen(PORT, () => console.log(`Listening to http:\\localhost:${PORT}`));