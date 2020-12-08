const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createArticle, deleteArticle, getAllArticles,
} = require('../controllers/articles');
const auth = require('../middlewares/auth');

router.use(auth);

router.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24),
  }),
}), deleteArticle);

router.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().regex(/^(ftp|http|https):\/\/([-\w.]+)\.([a-z]{2,})(\/|\/([\w#!:.?+=&%@!-/])*)?$/),
    image: Joi.string().required().regex(/^(ftp|http|https):\/\/([-\w.]+)\.([a-z]{2,})(\/|\/([\w#!:.?+=&%@!-/])*)?$/),
  }),
}), createArticle);

router.get('/articles', getAllArticles);

module.exports = router;
