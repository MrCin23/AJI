CREATE TABLE users (
  login VARCHAR(30) PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL CHECK (role IN ('CLIENT', 'EMPLOYEE'))
);