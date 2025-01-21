CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price > 0),
    unit_weight NUMERIC(10, 2) NOT NULL CHECK (unit_weight > 0),
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE ON UPDATE CASCADE
);