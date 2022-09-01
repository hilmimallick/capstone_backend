const bodyParser = require("body-parser");
const con = require("../lib/db_connection");
const express = require("express");
const router = express.Router();
const middleware = require("../middleware/auth");

// get cart items from user
router.get("/users/:id/cart", middleware, (req, res) => {
  try {
    const strQuery = "SELECT cart FROM users WHERE user_id = ?";
    con.query(strQuery, [req.user.user_id], (err, results) => {
      if (err) throw err;
      (function Check(a, b) {
        a = parseInt(req.user.user_id);
        b = parseInt(req.params.id);
        if (a === b) {
          //   res.send(results[0].cart);
          console.log(results[0]);
          res.json(JSON.parse(results[0].cart));
        } else {
          res.json({
            a,
            b,
            msg: "Please Login To View cart",
          });
        }
      })();
    });
  } catch (error) {
    throw error;
  }
});
// add cart items
router.post("/users/:id/cart", middleware, bodyParser.json(), (req, res) => {
  try {
    let { product_id } = req.body;
    const qcart = `SELECT cart
      FROM users
      WHERE user_id = ?;
      `;
    con.query(qcart, req.user.user_id, (err, results) => {
      if (err) throw err;
      let cart;
      if (results.length > 0) {
        if (results[0].cart === null) {
          cart = [];
        } else {
          cart = JSON.parse(results[0].cart);
        }
      }
      const strProd = `
      SELECT *
      FROM products
      WHERE product_id = ${product_id};
      `;

      con.query(strProd, async (err, results) => {
        if (err) throw err;
        let product = {
          cartid: cart.length + 1,
          id: results[0].id,
          name: results[0].name,
          price: results[0].price,
          description: results[0].description,
          artist: results[0].artist,
          image: results[0].image,
          category: results[0].category,
          size: results[0].size,
        };
        cart.push(product);
        // res.send(cart)
        const strQuery = `UPDATE users
      SET cart = ?
      WHERE (user_id = ${req.user.user_id})`;
        con.query(strQuery, /*req.user.id */ JSON.stringify(cart), (err) => {
          if (err) throw err;
          res.json({
            results,
            msg: "Product added to cart",
          });
        });
      });
    });
  } catch (error) {
    console.log(error.message);
  }
});
// delete one item from cart
router.delete("/users/:id/cart/:cartid", middleware, (req, res) => {
  const dcart = `SELECT cart
    FROM users
    WHERE user_id = ?`;
  con.query(dcart, req.user.user_id, (err, results) => {
    if (err) throw err;
    let item = JSON.parse(results[0].cart).filter((x) => {
      return x.cartid != req.params.product_id;
    });
    // res.send(item)
    const strQry = `
    UPDATE users
    SET cart = ?
    WHERE user_id= ? ;
    `;
    con.query(
      strQry,
      [JSON.stringify(item), req.user.user_id],
      (err, data, fields) => {
        if (err) throw err;
        res.json({
          msg: "Item Removed from cart",
        });
      }
    );
  });
});
// delete all cart items
router.delete("/users/:id/cart", middleware, (req, res) => {
  const dcart = `SELECT cart
    FROM users
    WHERE user_id = ?`;
  con.query(dcart, req.user.user_id, (err, results) => {
    // let cart =
  });
  const strQry = `
    UPDATE users
      SET cart = null
      WHERE (user_id = ?);
      `;
  con.query(strQry, [req.user.user_id], (err, data, fields) => {
    if (err) throw err;
    res.json({
      msg: "Item Deleted",
    });
  });
});

module.exports = router;
