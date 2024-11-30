const ProductModel = require('../orm/Product');
const CategoryRepository = require('./CategoryRepository'); // Repozytorium kategorii
const Product = require('../model/Product');

class ProductRepository {
    async create(product) {
        // Sprawdzenie, czy kategoria jest poprawna
        const category = await CategoryRepository.findByName(product.category.getName());
        if (!category) {
            throw new Error(`Category ${product.category.getName()} does not exist.`);
        }

        // Tworzenie produktu w bazie danych
        const createdProduct = await ProductModel.create({
            name: product.name,
            description: product.description,
            unitPrice: product.unitPrice,
            unitWeight: product.unitWeight,
            categoryId: category.id, // Przypisanie ID kategorii
        });

        return new Product(createdProduct.name, createdProduct.description, createdProduct.unitPrice, createdProduct.unitWeight, product.category);
    }

    async findAll() {
        const products = await ProductModel.findAll({
            include: CategoryRepository.getCategoryModel(), // Ładowanie powiązanej kategorii
        });

        return products.map(p => new Product(p.name, p.description, p.unitPrice, p.unitWeight, p.Category));
    }

    async findById(id) {
        const product = await ProductModel.findByPk(id, {
            include: CategoryRepository.getCategoryModel(),
        });
        if (!product) return null;

        return new Product(product.name, product.description, product.unitPrice, product.unitWeight, product.Category);
    }

    async update(id, newProductData) {
        const product = await ProductModel.findByPk(id);
        if (!product) return null;

        // Sprawdzenie, czy kategoria jest poprawna
        const category = await CategoryRepository.findByName(newProductData.category.getName());
        if (!category) {
            throw new Error(`Category ${newProductData.category.getName()} does not exist.`);
        }

        product.name = newProductData.name;
        product.description = newProductData.description;
        product.unitPrice = newProductData.unitPrice;
        product.unitWeight = newProductData.unitWeight;
        product.categoryId = category.id;

        await product.save();

        return new Product(product.name, product.description, product.unitPrice, product.unitWeight, newProductData.category);
    }

    async delete(id) {
        const product = await ProductModel.findByPk(id);
        if (!product) return null;

        await product.destroy();
        return true;
    }
}

module.exports = new ProductRepository();
