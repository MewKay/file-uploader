const filesGet = (req, res) => {
  res.render("files", { title: "Your Files" });
};

module.exports = { filesGet };
