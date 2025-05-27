const router = require("express").Router();
const Vegetable = require("../model/Vegetables");
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

// http://localhost:8070/vegetable/add
router.post("/add", upload.single("image"), async (req, res) => {
  const { name, price, quantity } = req.body;
  const image = req.file ? req.file.filename : null;

  const newVegetable = new Vegetable({
    name,
    image,
    price,
    quantity,
  });

  newVegetable
    .save()
    .then(() => res.json("Vegetable added successfully!"))
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error adding vegetable");
    });
});

// http://localhost:8070/vegetable/
router.get("/", (req, res) => {
  Vegetable.find()
    .then((vegetables) => res.json(vegetables))
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving vegetables");
    });
});

// http://localhost:8070/vegetable/update/:id
router.put("/update/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id;
  const { name, price, quantity } = req.body;
  const image = req.file ? req.file.filename : req.body.image; // Keep old image if not uploading new one

  const updatedData = { name, image, price, quantity };

  await Vegetable.findByIdAndUpdate(id, updatedData)
    .then(() => res.status(200).send("Vegetable updated successfully"))
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error updating vegetable");
    });
});

// http://localhost:8070/vegetable/delete/:id
router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  await Vegetable.findByIdAndDelete(id)
    .then(() => res.status(200).send("Vegetable deleted successfully"))
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting vegetable");
    });
});

// http://localhost:8070/vegetable/get/:id
router.get("/get/:id", async (req, res) => {
  const id = req.params.id;

  await Vegetable.findById(id)
    .then((veg) => res.status(200).json(veg))
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error fetching vegetable");
    });
});

module.exports = router;
