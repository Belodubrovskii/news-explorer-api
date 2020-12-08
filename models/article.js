const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(ftp|http|https):\/\/([-\w.]+)\.([a-z]{2,})(\/|\/([\w#!:.?+=&%@!-/])*)?$/.test(v);
      },
      message: (props) => `${props.value} is not a valid url!`,
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(ftp|http|https):\/\/([-\w.]+)\.([a-z]{2,})(\/|\/([\w#!:.?+=&%@!-/])*)?$/.test(v);
      },
      message: (props) => `${props.value} is not a valid url!`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('article', ArticleSchema);
