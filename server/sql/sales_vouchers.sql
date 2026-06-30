CREATE TABLE sales_vouchers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    customer_ledger_id INTEGER REFERENCES ledgers(id) ON DELETE CASCADE,

    voucher_number VARCHAR(50) UNIQUE NOT NULL,
    voucher_date DATE NOT NULL,

    subtotal DECIMAL(12,2) NOT NULL,
    gst_amount DECIMAL(12,2) NOT NULL,
    grand_total DECIMAL(12,2) NOT NULL,

    narration TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sales_voucher_items (
    id SERIAL PRIMARY KEY,

    sales_voucher_id INTEGER
        REFERENCES sales_vouchers(id)
        ON DELETE CASCADE,

    stock_item_id INTEGER
        REFERENCES stock_items(id)
        ON DELETE CASCADE,

    quantity INTEGER NOT NULL,
    rate DECIMAL(12,2) NOT NULL,
    gst_percentage DECIMAL(5,2) NOT NULL,
    total DECIMAL(12,2) NOT NULL
);