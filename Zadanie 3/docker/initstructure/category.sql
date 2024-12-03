CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

INSERT INTO category (name) VALUES
('CPU'),
('GPU'),
('Memory'),
('Disk'),
('CPU cooler'),
('Motherboards'),
('PSU'),
('Monitor'),
('Mouse'),
('Keyboard');