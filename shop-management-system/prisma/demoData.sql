INSERT INTO "Entity" ("id", "entityType", "name", "email", "number", "price", "quantity", "description", "category", "jsonPayload", "modifiedOn", "modifiedBy") 
VALUES 
  (gen_random_uuid(), 'CUSTOMER', 'Alice Brown', 'alice.brown@example.com', '9876543210', NULL, NULL, NULL, NULL, NULL, '2024-12-19T16:45:59', '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), 'CUSTOMER', 'Bob Johnson', 'bob.johnson@example.com', '9123456789', NULL, NULL, NULL, NULL, NULL, '2024-12-19T16:45:59', '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), 'CUSTOMER', 'Charlie Davis', 'charlie.davis@example.com', '9012345678', NULL, NULL, NULL, NULL, NULL, '2024-12-19T16:45:59', '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), 'CUSTOMER', 'David Williams', 'david.williams@example.com', '9345678901', NULL, NULL, NULL, NULL, NULL, '2024-12-19T16:45:59', '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), 'CUSTOMER', 'Emily Miller', 'emily.miller@example.com', '9801234567', NULL, NULL, NULL, NULL, NULL, '2024-12-19T16:45:59', '00000000-0000-0000-0000-000000000000');
INSERT INTO "Entity" ("id", "entityType", "name", "email", "number", "price", "quantity", "description", "category", "jsonPayload", "modifiedOn", "modifiedBy") 
VALUES 
  (gen_random_uuid(), 'PRODUCT', 'Bottle', NULL, NULL, 799.99, 50, '15-inch laptop with Intel i7 processor', 'Electronics', NULL, '2024-12-19T16:45:59', '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), 'PRODUCT', 'Eggs', NULL, NULL, 99.99, 100, 'Noise-cancelling wireless headphones', 'Accessories', NULL, '2024-12-19T16:45:59', '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), 'PRODUCT', 'Milk', NULL, NULL, 199.99, 75, 'Smartwatch with fitness tracking features', 'Electronics', NULL, '2024-12-19T16:45:59', '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), 'PRODUCT', 'Tea', NULL, NULL, 499.99, 20, '55-inch LED TV with 4K resolution', 'Electronics', NULL, '2024-12-19T16:45:59', '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), 'PRODUCT', 'Coffee', NULL, NULL, 89.99, 150, 'Voice-controlled smart speaker with Alexa', 'Home Appliances', NULL, '2024-12-19T16:45:59', '00000000-0000-0000-0000-000000000000');
-- Insert 5 Products
INSERT INTO "Entity" ("id", "entityType", "name", "email", "number", "price", "quantity", "description", "category", "jsonPayload", "modifiedOn", "modifiedBy") 
VALUES 
  (gen_random_uuid(), 'PRODUCT', 'Laptop', NULL, NULL, 999.99, 10, 'High-performance laptop', 'Electronics', NULL, NOW(), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), 'PRODUCT', 'Headphones', NULL, NULL, 49.99, 50, 'Noise-cancelling headphones', 'Electronics', NULL, NOW(), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), 'PRODUCT', 'Keyboard', NULL, NULL, 29.99, 30, 'Mechanical keyboard', 'Accessories', NULL, NOW(), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), 'PRODUCT', 'Monitor', NULL, NULL, 199.99, 20, '4K UHD monitor', 'Electronics', NULL, NOW(), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), 'PRODUCT', 'Mouse', NULL, NULL, 19.99, 40, 'Wireless mouse', 'Accessories', NULL, NOW(), '00000000-0000-0000-0000-000000000000');

-- Insert 2 Customers
INSERT INTO "Entity" ("id", "entityType", "name", "email", "number", "price", "quantity", "description", "category", "jsonPayload", "modifiedOn", "modifiedBy") 
VALUES
  (gen_random_uuid(), 'CUSTOMER', 'Alice Johnson', 'alice.johnson@example.com', '1234567890', NULL, NULL, NULL, NULL, NULL, NOW(), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), 'CUSTOMER', 'Bob Smith', 'bob.smith@example.com', '0987654321', NULL, NULL, NULL, NULL, NULL, NOW(), '00000000-0000-0000-0000-000000000000');

DO $$
DECLARE
    random_customer_id UUID;
    random_product_id UUID;
    random_quantity INT;
    random_price NUMERIC;
    transaction_id UUID;
    order_id UUID;
    order_ids UUID[]; -- Array to hold order IDs
    order_price NUMERIC; -- Variable to hold the price of each order
    total_transaction_price NUMERIC := 0; -- Variable to hold the total transaction price
    i INT;
BEGIN
    -- Loop to create 10 random transactions
    FOR i IN 1..10 LOOP
        -- Pick a random customer ID
        SELECT "id" INTO random_customer_id
        FROM "Entity"
        WHERE "entityType" = 'CUSTOMER'
        ORDER BY RANDOM()
        LIMIT 1;

        -- Initialize the order_ids array and total transaction price
        order_ids := '{}';
        total_transaction_price := 0;

        -- Create 3 orders for the current transaction
        FOR j IN 1..5 LOOP
            -- Pick a random product ID and price
            SELECT "id", "price" INTO random_product_id, random_price
            FROM "Entity"
            WHERE "entityType" = 'PRODUCT'
            ORDER BY RANDOM()
            LIMIT 1;

            -- Random quantity for each product
            random_quantity := (FLOOR(RANDOM() * 10) + 1)::INT;

            -- Calculate the order price (price * quantity)
            order_price := random_price * random_quantity;

            -- Create an order record
            INSERT INTO "Entity" ("id", "entityType", "price", "quantity", "jsonPayload", "modifiedOn", "modifiedBy")
            VALUES (
                gen_random_uuid(), 'ORDER', order_price, random_quantity,
                jsonb_build_object('product', random_product_id, 'quantity', random_quantity, 'price', order_price), NOW(), random_customer_id
            )
            RETURNING "id" INTO order_id;

            -- Append the order_id to the order_ids array
            order_ids := array_append(order_ids, order_id);

            -- Add the order price to the total transaction price
            total_transaction_price := total_transaction_price + order_price;
        END LOOP;

        -- Create the transaction record with the list of orders and total transaction price
        INSERT INTO "Entity" ("id", "entityType", "jsonPayload", "price", "modifiedOn", "modifiedBy")
        VALUES (
            gen_random_uuid(), 'TRANSACTION',
            jsonb_build_object('customer', random_customer_id, 'orders', order_ids), total_transaction_price, NOW(), random_customer_id
        )
        RETURNING "id" INTO transaction_id;
    END LOOP;
END $$;

--truncate table "Entity"
--SELECT * FROM "Entity"