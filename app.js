const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-err');
const IncorrectDataError = require('./errors/incorrect-data');

const app = express();

app.use(helmet());

const usersRouter = require('./routes/users.js');
const articlesRouter = require('./routes/articles.js');

const { PORT = 3000, MONGO_ADDRESS, NODE_ENV } = process.env;

mongoose.connect(NODE_ENV === 'production' ? MONGO_ADDRESS : 'mongodb://localhost:27017/newsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  if (err.name === 'SyntaxError') {
    return next(new IncorrectDataError('Невалидный JSON'));
  }
  return next();
});

app.use(requestLogger);

app.use(
  usersRouter,
);

app.use(
  articlesRouter,
);

app.use('*', (req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
