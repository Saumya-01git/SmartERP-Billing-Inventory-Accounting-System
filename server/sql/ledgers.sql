CREATE TABLE IF NOT EXISTS ledgers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,

  ledger_name VARCHAR(255) NOT NULL,
  ledger_type VARCHAR(50) NOT NULL,
  ledger_group VARCHAR(100) NOT NULL,

  opening_balance DECIMAL(12,2) DEFAULT 0,
  phone VARCHAR(20),
  email VARCHAR(150),
  address TEXT,
  gst_number VARCHAR(50),
  notes TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);