const TermsCondition = require("../models/TermsCondition");

exports.create = async (req, res) => {
  const { name, description } = req.body;
  const data = await TermsCondition.query().insert({ name, description });
  res.json(data);
};

exports.getAll = async (req, res) => {
  const data = await TermsCondition.query().orderBy("id", "desc");
  res.json(data);
};

exports.getOne = async (req, res) => {
  const data = await TermsCondition.query().findById(req.params.id);

  if (!data) {
    return res.status(404).json({
      message: "Terms and conditions not found"
    });
  }

  res.status(200).json(data);
};


exports.update = async (req, res) => {
  const { name, description } = req.body;
  await TermsCondition.query()
    .patch({ name, description })
    .where("id", req.params.id);
  res.json({ message: "Updated successfully" });
};

exports.remove = async (req, res) => {
  await TermsCondition.query().deleteById(req.params.id);
  res.json({ message: "Deleted successfully" });
};
