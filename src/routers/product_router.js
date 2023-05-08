// Router for connecting to and manipulating Products
// Written by Bardia Habib Khoda

// Library injections
const express = require("express");
const product_router = express.Router();

// Bringing SQL connector in
const database_connector = require("../middleware/database_connector");
const sql = database_connector();

// POST /product/list
product_router.post('/product/list', async (req, res) => {
  try {
    const { category, price_range, search_query, sort_by } = req.body.FilterContexts;

    // Construct the SQL query using parameterized queries
    // This basically creates SQL queries based on what we have supplied
    // as FilterContexts 
    // This section COULD be dangerous for SQL injection, but paramterized
    // queries will hopefully avoid that.

    const query = `
      SELECT *
      FROM products
      WHERE category = @category
        AND price BETWEEN @min_price AND @max_price
        AND (product_name LIKE @search_query OR product_description LIKE @search_query)
      ORDER BY @sort_by
    `;

    // Set the parameter values for the SQL query
    const min_price = price_range.min_price || 0;
    const max_price = price_range.max_price || Number.MAX_SAFE_INTEGER;
    const search_query_like = `%${search_query}%`;

    // Connect to the datbase
    const pool = sql.createConnection();

    // Execute the SQL query and return the results
    const result = await sql.query(query, {
      category,
      min_price,
      max_price,
      search_query_like,
      sort_by,
    });

    return res.status(200).json({ products: result.recordset });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /product/modify
product_router.patch('/product/modify', async (req, res) => {
  try {
    const changedInstruction = req.body.changedInstruction;
    //Validate the changedInstruction object here
    //...

    // Create connection
    const pool = sql.createConnection();

    //Begin a transaction to ensure atomicity of the modifications
    const transaction = await pool.transaction();

    //Execute each modification in the changedInstruction array as a separate query
    for (const instruction of changedInstruction) {
      await transaction.request()
        .input('productId', sql.Int, instruction.product_id)
        .input('productName', sql.VarChar, instruction.product_name)
        .input('productDescription', sql.VarChar, instruction.product_description)
        .input('productSkuNumber', sql.VarChar, instruction.product_sku_number)
        .input('productCategory', sql.VarChar, instruction.product_category)
        .input('productPrice', sql.Decimal, instruction.product_price)
        .input('productTags', sql.VarChar, instruction.product_tags)
        .query('UPDATE Products SET Name = @productName, Description = @productDescription, SkuNumber = @productSkuNumber, Category = @productCategory, Price = @productPrice, Tags = @productTags WHERE Id = @productId');
    }

    //Commit the transaction to apply the modifications
    await transaction.commit();

    //Close the connection pool
    await pool.close();

    res.send('Modifications applied successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE /product/delete
product_router.delete('/product/delete', async (req, res) => {
  try {
    const { product_id } = req.body;

    // Create connection
    const pool = sql.createConnection();

    // Validate that product_id exists in the database
    const product = await sql.query`
      SELECT *
      FROM products
      WHERE product_id = ${product_id}
    `;
    if (!product.recordset.length) {
      return res.status(404).json({ error: `Product with id ${product_id} not found` });
    }

    // Delete product with the specified product_id from the database
    await sql.query`
      DELETE FROM products
      WHERE product_id = ${product_id}
    `;

    return res.status(200).json({ message: `Product with id ${product_id} deleted successfully` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Export product_router
module.export = product_router;