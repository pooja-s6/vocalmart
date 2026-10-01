CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    stock_quantity INTEGER NOT NULL,
    category_id BIGINT NOT NULL REFERENCES categories (id),
    rating NUMERIC(2, 1) NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_products_price CHECK (price >= 0),
    CONSTRAINT ck_products_stock CHECK (stock_quantity >= 0),
    CONSTRAINT ck_products_rating CHECK (rating >= 0 AND rating <= 5)
);

CREATE INDEX idx_products_category_id ON products (category_id);
