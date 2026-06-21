# Database Design

## users
- id
- name
- email
- password
- created_at

## companies
- id
- user_id
- name
- address
- gst_number
- state
- financial_year
- created_at

## ledgers
- id
- company_id
- name
- type
- opening_balance
- created_at

## customers
- id
- company_id
- ledger_id
- name
- mobile
- address
- outstanding_balance

## suppliers
- id
- company_id
- ledger_id
- name
- mobile
- address
- outstanding_balance

## stock_items
- id
- company_id
- item_name
- sku
- purchase_price
- selling_price
- quantity
- gst_percentage
- unit

## purchases
- id
- company_id
- supplier_id
- invoice_number
- total_amount
- gst_amount
- date

## purchase_items
- id
- purchase_id
- stock_item_id
- quantity
- rate
- amount

## sales
- id
- company_id
- customer_id
- invoice_number
- total_amount
- gst_amount
- date

## sale_items
- id
- sale_id
- stock_item_id
- quantity
- rate
- amount

## inventory_transactions
- id
- company_id
- stock_item_id
- type
- quantity
- reference_type
- reference_id
- date