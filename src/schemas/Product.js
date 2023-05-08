// Schema for interacting with database
// Written by Bardia Habib Khoda

// Define the product schema
// TODO Fix this according to the actual database definitions

const productSchema = new mssql.Table('products');
productSchema.columns.add('product_id', mssql.NVarChar(50), { nullable: false });
productSchema.columns.add('product_name', mssql.NVarChar(50), { nullable: false });
productSchema.columns.add('product_description', mssql.NVarChar(500), { nullable: false });
productSchema.columns.add('product_sku_number', mssql.NVarChar(50), { nullable: false });
productSchema.columns.add('product_category', mssql.NVarChar(50), { nullable: false });
productSchema.columns.add('product_price', mssql.Decimal(18, 2), { nullable: false });
productSchema.columns.add('product_tags', mssql.NVarChar(500), { nullable: true });

// Define the product model
const Product = mssql.model('Product', productSchema);
