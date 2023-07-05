const Article = require("../models/articleModel");

const create = async (req, res) => {
  const { title, content } = req.body;
  try {
    const article = await Article({ title, content });
    article.save().then((saveArticle) => {
      res.status(201).json(saveArticle);
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Erreur lors de la sauvegarde de l'article` });
  }
};
const showArticle = async (req, res) => {
  try {
    const article = await Article.findOne({_id: req.params.id});
    res.status(200).render("show", { article: article });
  } catch (error) {
    res.json({ message: "Article non trouvé" });
  }
};

const listArticle = async (req, res) => {
  try {
    const article = await Article.find();
    res.status(200).render("list", { article: article });
  } catch (error) {
    res.json({ message: "Article non trouvé" });
  }
};

const deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete({ _id: req.params.id })
    .then(() => res.status(201).json({message: "Article deleted"}))
  } catch (error) {
    res.json({ message: "Article non trouvé" });
  }
}

const updateArticle = async (req, res) => {
  try {
    await Article.findOneAndUpdate(
      {
        _id: req.params.id
      },
      {
        "title": req.body.title,
        "content": req.body.content
      }
    )
    .then(() => res.status(201).json({message: "Article updated"}))
  } catch (error) {
    res.json({ message: "Article non trouvé" });
  }
}

const comments = async (req, res) => {
  try {
    const { id } = req.params;
    const { author, content } = req.body;
    await Article.findById(id)
      .then((article) => {
        if (!article) {
          return res.status(404).json({ error: "Article introuvable" });
        }
        const comment = { author, content };
        article.comments.push(comment);
        return article.save();
      })
      .then((updateArticle) => {
        res.json(updateArticle);
      });
  } catch (error) {
    res.status(500).json({ error: `Erreur lors de l'ajout du commentaire` });
  }
};

const applaud = async (req, res) => {
  try {
    const { id } = req.params;
    await Article.findById(id)
      .then((article) => {
        if (!article) {
          return res.status(404).json({ error: "Article introuvable" });
        }
        article.applauseCount++;
        return article.save();
      })
      .then((updateArticle) => res.json(updateArticle));
  } catch (error) {
    res
      .status(500)
      .json({ error: `Erreur lors de l'ajoout d'applaudissements` });
  }
};
module.exports = { create, comments, applaud, showArticle, listArticle, deleteArticle, updateArticle };
