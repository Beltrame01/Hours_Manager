const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3300;


// custom middleware logger
// esta chamada se refere ao javascript para criação do log de eventos
app.use(logger);

// Cross Origin Resource Sharing
// Utilize o CORS para restringir os sites que podem acessar o seu back-end
// Crie uma White List de links aceitos e a configure dentro do corsOptions
app.use(cors(corsOptions));


// built-in middleware to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({extended: false}));

// built-in middleware for json
app.use(express.json());

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/employees', require('./routes/api/employees'));


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