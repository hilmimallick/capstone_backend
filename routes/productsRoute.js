const express = require("express");
const router = express.Router();
const con = require("../lib/db_connection");

router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM products", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.get("/:id", (req, res) => {
  try {
    con.query(
      `SELECT * FROM products WHERE product_id = "${req.params.id}"`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.post("/", (req, res) => {
  const { name, price, description, artist, image, category, size } = req.body;
  try {
    con.query(
      `INSERT INTO products (name,price,description,artist,image,category,size) values('${name}', '${price}', '${description}', '${artist}', '${image}', '${category}', '${size}') `,
      (err, result) => {
        if (err) throw err;
        res.json({
          msg: "U added this art",
          results: result,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
});

router.put("/:id", (req, res) => {
  const { name, price, description, artist, image, category, size } = req.body;
  try {
    con.query(
      `UPDATE products SET name='${name}', price='${price}', description='${description}', artist='${artist}', image ='${image}', category='${category}',
      size='${size}' WHERE product_id ='${req.params.id}'`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.delete("/:id", (req, res) => {
  try {
    con.query(
      `DELETE FROM products WHERE product_id = ${req.params.id}`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;
