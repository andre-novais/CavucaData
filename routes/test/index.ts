var router = require("express").Router();

router.use("/", function (req, res) {
  res.redirect(
    "http://dados.fortaleza.ce.gov.br/dataset/8e995f96-423c-41f3-ba33-9ffe94aec2a8/resource/de4e876a-ee24-4d6e-9722-db9dc454bbe6/download/policecalls.csv"
  );
});

module.exports = router;
