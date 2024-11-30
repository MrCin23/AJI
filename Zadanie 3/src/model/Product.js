const Category = require('./Category');

class Product {
    constructor(name, description, unitPrice, unitWeight, category) {
        if (!name || typeof name !== "string") {
            throw new Error("Invalid name: must be a non-empty string.");
        }
        if (typeof description !== "string") {
            throw new Error("Invalid description: must be a string.");
        }
        if (typeof unitPrice !== "number" || unitPrice <= 0) {
            throw new Error("Invalid unit price: must be a positive number.");
        }
        if (typeof unitWeight !== "number" || unitWeight <= 0) {
            throw new Error("Invalid unit weight: must be a positive number.");
        }
        if (!(category instanceof Category)) {
            throw new Error("Invalid category: must be an instance of Category.");
        }

        this.name = name;
        this.description = description;
        this.unitPrice = unitPrice;
        this.unitWeight = unitWeight;
        this.category = category;
    }

    getDetails() {
        return {
            name: this.name,
            description: this.description,
            unitPrice: this.unitPrice,
            unitWeight: this.unitWeight,
            category: this.category.getName()
        };
    }

    changeCategory(newCategory) {
        if (!Category.isValidCategory(newCategory)) {
            throw new Error(`Invalid category: ${newCategory} does not exist.`);
        }
        this.category = newCategory;
    }
}

module.exports = Product;
