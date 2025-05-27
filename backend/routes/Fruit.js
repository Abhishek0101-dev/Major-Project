const router = require("express").Router();
const Fruit = require("../model/Fruit");
const multer = require("multer");
const path = require("path");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST - Add Fruit
// http://localhost:8070/fruit/add
router.post("/add", upload.single("image"), async (req, res) => {
  const { name, price, quantity } = req.body;
  const image = req.file ? req.file.filename : null;

  const newFruit = new Fruit({
    name,
    image,
    price,
    quantity,
  });

  newFruit
    .save()
    .then(() => res.json("Fruit added successfully!"))
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error adding fruit");
    });
});

// GET - All Fruits
// http://localhost:8070/fruit/
router.get("/", (req, res) => {
  Fruit.find()
    .then((fruits) => res.json(fruits))
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving fruits");
    });
});

// PUT - Update Fruit
// http://localhost:8070/fruit/update/:id
router.put("/update/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id;
  const { name, price, quantity } = req.body;
  const image = req.file ? req.file.filename : req.body.image;

  const updatedData = { name, image, price, quantity };

  await Fruit.findByIdAndUpdate(id, updatedData)
    .then(() => res.status(200).send("Fruit updated successfully"))
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error updating fruit");
    });
});

// DELETE - Delete Fruit
// http://localhost:8070/fruit/delete/:id
router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  await Fruit.findByIdAndDelete(id)
    .then(() => res.status(200).send("Fruit deleted successfully"))
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting fruit");
    });
});

// GET - Single Fruit
// http://localhost:8070/fruit/get/:id
router.get("/get/:id", async (req, res) => {
  const id = req.params.id;

  await Fruit.findById(id)
    .then((fruit) => res.status(200).json(fruit))
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error fetching fruit");
    });
});

module.exports = router;
