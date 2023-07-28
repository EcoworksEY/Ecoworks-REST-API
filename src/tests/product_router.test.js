// test suite to ensure Product router behaves as expected
// Written by Bardia Habibkhoda

const request = require('supertest');
const app = require('../index'); 
const Chance = require('chance');

const chance = new Chance();

describe('Test Product Endpoints', () => {
  test('GET /product/list should return a list of all products and status 200', async () => {
    const response = await request(app).get('/product/list');

    expect(response.status).toBe(200);
    expect(response.body.products).toBeDefined();
    expect(Array.isArray(response.body.products)).toBeTruthy();
  });

  test('GET /product/list with query param should return a single product and status 200', async () => {
    // Assuming there is at least one product in the database
    const responseAllProducts = await request(app).get('/product/list');
    const firstProduct = responseAllProducts.body.products[0];

    const response = await request(app).get(`/product/list?product_id=${firstProduct.product_id}`);

    expect(response.status).toBe(200);
    expect(response.body.products).toBeDefined();
    expect(Array.isArray(response.body.products)).toBeTruthy();
    expect(response.body.products.length).toBe(1);
    expect(response.body.products[0].product_id).toBe(firstProduct.product_id);
  });

  test('GET /product/photo-link should return photo links for a product and status 200', async () => {
    // Assuming there is at least one product in the database
    const responseAllProducts = await request(app).get('/product/list');
    const firstProduct = responseAllProducts.body.products[0];

    const response = await request(app).get(`/product/photo-link?product_id=${firstProduct.product_id}`);

    expect(response.status).toBe(200);
    expect(response.body.photos).toBeDefined();
    expect(Array.isArray(response.body.photos)).toBeTruthy();
  });

  test('PATCH /product/modify should modify products and return status 200', async () => {
    // Assuming there is at least one product in the database
    const responseAllProducts = await request(app).get('/product/list');
    const firstProduct = responseAllProducts.body.products[0];

    const response = await request(app)
      .patch('/product/modify')
      .send({
        changeInstructions: [
          {
            product_id: firstProduct.product_id,
            name: 'Modified Product Name',
            description: 'Modified product description',
            price: 100,
            sku_units: 10,
          },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body.product_ids).toBeDefined();
    expect(Array.isArray(response.body.product_ids)).toBeTruthy();
    expect(response.body.product_ids).toContain(firstProduct.product_id);
  });

  test('DELETE /product/delete should delete products and return status 200', async () => {
    // Assuming there is at least one product in the database
    const responseAllProducts = await request(app).get('/product/list');
    const firstProduct = responseAllProducts.body.products[0];

    const response = await request(app)
      .delete('/product/delete')
      .send({
        product_ids: [firstProduct.product_id],
      });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].product_id).toBe(firstProduct.product_id);
  });

  test('POST /product/add should add new products and return status 200', async () => {
    // Assuming the provided product data is valid
    const newProductData = [
        {
          product_id: chance.guid(),
          name: chance.sentence({ words: 3 }),
          description: chance.paragraph(),
          price: chance.floating({ min: 1, max: 100, fixed: 2 }),
          sku_units: chance.integer({ min: 1, max: 100 })
        },
        {
          product_id: chance.guid(),
          name: chance.sentence({ words: 3 }),
          description: chance.paragraph(),
          price: chance.floating({ min: 1, max: 100, fixed: 2 }),
          sku_units: chance.integer({ min: 1, max: 100 })
        },
      ];

    const response = await request(app)
      .post('/product/add')
      .send({
        productObjects: newProductData,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Successfully inserted all new products');
  });
});
