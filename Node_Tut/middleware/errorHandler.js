const { logEvents } = require('./logEvents');

// função para apresentar a mensagem em caso de erro
// esta função também gera um log, salvo em errLog.txt
const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt')
    console.error(err.stack);
    res.status(500).send(err.message);
}

module.exports = errorHandler;