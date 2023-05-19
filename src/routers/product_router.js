// Router for connecting to and manipulating Products
// Written by Bardia Habib Khoda

// Library injections
const express = require("express");
const product_router = express.Router();

// Bringing SQL connector in
const database_connector = require("../middleware/database_connector");

product_router.get('/list', async (req, res) => {
  // Getting a list o fall available products

  // Connect to PSQL
  // Assuming PSQL is hosted on DB Port and at Localhost
  try {
      // Run list query in PSQL
      database_connector.query('SELECT * FROM product;', (err, data) => {
      if (err) {
        // Error occured
        console.error("Internal Server Error.", err);
        //database_connector.end();
        return res.status(err.status).json({ error: err });
      }
      else {
        // Safely return all of the products
        //database_connector.end();
        return res.status(200).json({ products: data.rows });
      }
    }) 
      } catch (error) {
        // Error caught
        console.error("Internal server error", error);
        //database_connector.end();
        res.status(500).json({error: error});
}
});

// PATCH /product/modify
product_router.patch('/modify', async (req, res) => {
  try {
    // This shows assuming that changedInsturction object contains what we see here
    // Any of this fails, we fail.

    // Get the ChangeInstructions object
    // If any of the keys don;t match, the catch will come into effect.
    const { changeInstructions } = req.body;

    // Need SQL Injection checks here.
    /// TODO

    var product_ids = [];

    for (const instruction of changeInstructions) {
      const { product_id, ...changes } = instruction;

      // Check whether any of the input changes are invalid
      var keys = Object.keys(changes);
      for (var key of keys) {
        // A bit hardcoded
        console.log(key);
        if ((key != 'product_id') && (key != 'name') && (key != 'description') && (key != 'price'))
        {
          // Invalid key
          throw new Error(`change instruction with key ${key} is invalid`);
        }
      }

      const query = `
        UPDATE product
        SET ${Object.keys(changes)
          .map((key, index) => `${key} = $${index + 2}`)
          .join(', ')}
        WHERE product_id = $1
        RETURNING *
      `;

      const values = [product_id, ...Object.values(changes)];
      
      // Try modifying those rows
      const result = await database_connector.query(query, values);

      if (result.rows.length === 0) {
        throw new Error(`Product with ID ${product_id} not found`);
      }
      
      product_ids.push(product_id);
    }

    // don't forget to close the connection
    //database_connector.end();
    return res.status(200).json({ product_ids: product_ids});
  } catch (error) {
    console.error('Error modifying products:', error);
    //database_connector.end();
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /product/delete
product_router.delete('/delete', async (req, res) => {
  try {
    const { product_ids } = req.body;

    const query = `
      DELETE FROM product
      WHERE product_id = $1
      RETURNING *
    `;

    const result = await database_connector.query(query, [product_ids]);

    if (result.rows.length === 0) {
      throw new Error(`Product with ID ${product_ids} not found`);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to add products
product_router.post('/add', async (req, res) => {
  try {
    // Again, this just assumes you know the objects.
    // Enforcing and documentation to clarify later.
    const { productObjects } = req.body;

    for (const product of productObjects) {
      const { product_id, ...productData } = product;

      const query = `
        INSERT INTO product (product_id, name, description, price)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (product_id) DO NOTHING
      `;

      // This forces the same error mechanism as the if else seen on /modify
      const values = [
        product_id,
        productData.name,
        productData.description,
        productData.price
      ];

      await database_connector.query(query, values);
    }

    return res.status(200).json({ message: 'Successfully inserted all new products'});
  } catch (error) {
    console.error('Error adding products:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
// Export product_route
module.exports = product_router;