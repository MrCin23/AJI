CREATE TABLE order_status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO order_status (status)
VALUES
    ('UNAPPROVED'),
    ('APPROVED'),
    ('CANCELLED'),
    ('COMPLETED')
ON CONFLICT (status) DO NOTHING;