// Router for connecting to and manipulating Products
// Written by Bardia Habib Khoda

// Library injections
const express = require("express");
const product_router = express.Router();

// Bringing SQL connector in
const database_connector = require("../middleware/database_connector");

// POST /product/list
product_router.post('/product/list', async (req, res) => {
  try {
    const { FilterContexts } = req.body;

    const query = `
      SELECT *
      FROM products
      WHERE category = $1
        AND price BETWEEN $2 AND $3
    `;

    // This assumes you understand FilterContexts comes with possible 'category', etc.

    // TODO: Add the rest of the available FilterContexts
    const values = [
      FilterContexts.category,
      FilterContexts.minPrice,
      FilterContexts.maxPrice
    ];

    const result = await database_connector.query(query, values);

    return res.json({ products: result.rows });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /product/modify
product_router.patch('/product/modify', async (req, res) => {
  try {
    // This shows assuming that changedInsturction object contains what we see here
    // Any of this fails, we fail.

    const { changedInstruction } = req.body;

    for (const instruction of changedInstruction) {
      const { product_id, ...changes } = instruction;

      const query = `
        UPDATE products
        SET ${Object.keys(changes)
          .map((key, index) => `${key} = $${index + 2}`)
          .join(', ')}
        WHERE product_id = $1
        RETURNING *
      `;

      const values = [product_id, ...Object.values(changes)];

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        throw new Error(`Product with ID ${product_id} not found`);
      }
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error('Error modifying products:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /product/delete
app.delete('/product/delete', async (req, res) => {
  try {
    const { product_id } = req.body;

    const query = `
      DELETE FROM products
      WHERE product_id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [product_id]);

    if (result.rows.length === 0) {
      throw new Error(`Product with ID ${product_id} not found`);
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to add products
product_router.post('/product/add', async (req, res) => {
  try {

    // Again, this just assumes you know the objects.
    // Enforcing and documentation to clarify later.
    const { productObjects } = req.body;

    for (const product of productObjects) {
      const { product_id, ...productData } = product;

      const query = `
        INSERT INTO products (product_id, product_name, product_description, product_sku_number, product_category, product_price, product_tags)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (product_id) DO NOTHING
      `;

      const values = [
        product_id,
        productData.product_name,
        productData.product_description,
        productData.product_sku_number,
        productData.product_category,
        productData.product_price,
        productData.product_tags
      ];

      await pool.query(query, values);
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error('Error adding products:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Export product_router
module.export = product_router;