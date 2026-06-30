CREATE TABLE IF NOT EXISTS purchase_vouchers (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    supplier_ledger_id INTEGER NOT NULL REFERENCES ledgers(id) ON DELETE CASCADE,

    voucher_number VARCHAR(30) UNIQUE NOT NULL,
    voucher_date DATE NOT NULL,

    subtotal DECIMAL(12,2) DEFAULT 0,
    gst_amount DECIMAL(12,2) DEFAULT 0,
    grand_total DECIMAL(12,2) DEFAULT 0,

    narration TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchase_voucher_items (
    id SERIAL PRIMARY KEY,

    purchase_voucher_id INTEGER NOT NULL
        REFERENCES purchase_vouchers(id)
        ON DELETE CASCADE,

    stock_item_id INTEGER NOT NULL
        REFERENCES stock_items(id)
        ON DELETE CASCADE,

    quantity INTEGER NOT NULL,
    rate DECIMAL(12,2) NOT NULL,
    gst_percentage DECIMAL(5,2) DEFAULT 0,

    total DECIMAL(12,2) NOT NULL
);