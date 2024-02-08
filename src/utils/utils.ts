import { Request } from 'express';
import { celebrate, Joi } from 'celebrate';
import validator from 'validator';
import BadRequestError from './errors/BadRequestError';

export interface CustomRequest extends Request {
  user: {
    _id: string;
  };
}

export const createUserValidation = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required(),
      name: Joi.string()
        .min(2)
        .max(30),
      about: Joi.string()
        .min(2)
        .max(200),
      avatar: Joi.string()
        .custom((v: string) => {
          if (validator.isURL(v)) return v;
          throw new BadRequestError('Введите корректную ссылку =)');
        }),
    }),
});
export const loginValidation = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required(),
    }),
});
