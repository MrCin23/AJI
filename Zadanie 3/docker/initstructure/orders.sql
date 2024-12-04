CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) REFERENCES users(login) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    status_id INT REFERENCES order_status(id) ON DELETE SET NULL,
    approval_date TIMESTAMP,
    ordered_items JSONB NOT NULL DEFAULT '[]',
    opinion JSONB
);