const ProductRepository = require('../repository/ProductRepository');
const CategoryRepository = require('../repository/CategoryRepository');
const Product = require('../model/Product');
const Category = require('../model/Category');


class ProductManager {
    async createProduct(productData) {
        if (!productData.name || !productData.description || productData.unitPrice == null || productData.unitWeight == null) {
            throw new Error('Missing required product fields: name, description, unitPrice, or unitWeight');
        }

        if (!productData.category || !(productData.category instanceof Category)) {
            throw new Error('Invalid or missing category for the product');
        }

        const category = await CategoryRepository.findByName(productData.category.getName());
        if (!category) {
            throw new Error(`Category ${productData.category.getName()} does not exist`);
        }

        const product = new Product(
            productData.name,
            productData.description,
            productData.unitPrice,
            productData.unitWeight,
            category
        );

        return await ProductRepository.create(product);
    }

    async getAllProducts() {
        const products = await ProductRepository.findAll();
        if (products.length === 0) {
            throw new Error('No products found');
        }
        return products;
    }

    async getProductById(id) {
        if (!id || typeof id !== 'number') {
            throw new Error('Invalid product ID');
        }

        const product = await ProductRepository.findById(id);
        if (!product) {
            throw new Error(`Product with ID ${id} not found`);
        }

        return product;
    }

    async updateProduct(id, updatedProductData) {
        if (!id || typeof id !== 'number') {
            throw new Error('Invalid product ID');
        }

        const existingProduct = await ProductRepository.findById(id);
        if (!existingProduct) {
            throw new Error(`Product with ID ${id} not found`);
        }

        if (updatedProductData.category && !(updatedProductData.category instanceof Category)) {
            throw new Error('Invalid category provided');
        }

        const category = updatedProductData.category
            ? await CategoryRepository.findByName(updatedProductData.category.getName())
            : existingProduct.category;

        if (updatedProductData.category && !category) {
            throw new Error(`Category ${updatedProductData.category.getName()} does not exist`);
        }

        const updatedProduct = new Product(
            updatedProductData.name || existingProduct.name,
            updatedProductData.description || existingProduct.description,
            updatedProductData.unitPrice != null ? updatedProductData.unitPrice : existingProduct.unitPrice,
            updatedProductData.unitWeight != null ? updatedProductData.unitWeight : existingProduct.unitWeight,
            category
        );

        return await ProductRepository.update(id, updatedProduct);
    }

    async deleteProduct(id) {
        if (!id || typeof id !== 'number') {
            throw new Error('Invalid product ID');
        }

        const deleted = await ProductRepository.delete(id);
        if (!deleted) {
            throw new Error(`Product with ID ${id} not found or could not be deleted`);
        }

        return true;
    }
}

module.exports = new ProductManager();
