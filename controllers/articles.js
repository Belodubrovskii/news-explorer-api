const Article = require('../models/article.js');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data');
const ForbiddenError = require('../errors/forbidden-error');

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => res.send(article))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new IncorrectDataError('Переданы некорректные данные');
      }
      return next(err);
    })
    .catch(next);
};

const getAllArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send(articles))
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId).select('+owner')
    .then((article) => {
      if (!article) {
        return next(new NotFoundError('Статьи с таким Id нет в базе'));
      }

      const isOwner = article.owner.toString() === req.user._id.toString();
      if (isOwner) {
        return article.remove()
          .then(() => res.send({ message: 'Статья удалена' }))
          .catch(next);
      }
      return next(new ForbiddenError('Чужие статьи удалять нельзя!'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new IncorrectDataError('Некорректный Id статьи');
      }
      throw err;
    })
    .catch(next);
};

module.exports = {
  createArticle, getAllArticles, deleteArticle,
};
