const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createUser, login, getUserInfo,
} = require('../controllers/users.js');
const auth = require('../middlewares/auth');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(6).regex(/^\S+$/),
    email: Joi.string().email().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(6).regex(/^\S+$/),
    email: Joi.string().email().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

router.use(auth);

router.get('/users/me', getUserInfo);

module.exports = router;
