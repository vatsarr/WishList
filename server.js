const express = require("express");
const multer = require("multer");
const path = require("path");
const Wish = require("./model/wish");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("images"));

let upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./images");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
});

app.get("/", (req, res) => {
  Wish.fetchAllWishes((wishesFromFile) => {
    console.log(wishesFromFile);
    res.render("index", { myWishes: wishesFromFile });
  });
});

app.post("/wish", upload.single("userFile"), (req, res) => {
  let userData = req.body.userWish;
  let newWish = new Wish(userData, req.file.filename);
  newWish.saveWish();
  res.redirect("/");
});

const port = 5000;

/* app.listen(port, () => {
  console.log(`Server is running on ${port}.`);
}); */

app.listen(process.env.PORT || 3000, function () {
  console.log("Server has started.");
});
