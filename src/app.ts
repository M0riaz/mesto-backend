import * as mongoose from 'mongoose';
import express, { NextFunction, Request, Response } from 'express';
import { errors } from 'celebrate';
import cardRouter from './routes/cards';
import userRouter from './routes/users';
import { createUser, login } from './controllers/user';
import auth from './middlewares/auth';
import { errorLogger, requestLogger } from './middlewares/logger';
// eslint-disable-next-line import/named
import { createUserValidation, loginValidation } from './utils/utils';
import NotFoundError from './utils/errors/NotFoundError';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
// mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(requestLogger);
app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);

app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Запрошенный ресурс не найден.'));
});
app.use(errorLogger);
app.use(errors());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка =(' : err.message;

  res.status(statusCode)
    .send({ message });
});
app.listen(PORT, () => {
});
