SELECT * FROM inventory;


--Insert the account of the record
-- INSERT INTO account (account_firstname, account_lastname, account_email, account_password) VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Update the account and set the type of the column where the item is occur.
-- UPDATE account SET account_type = 'Admin' WHERE account_firstname='Tony' AND account_lastname='Stark';

-- Delete from the statement where the primary key or the item is the name.
-- DELETE FROM account WHERE account_firstname='Tony';

-- Select from account
-- SELECT * FROM account;




-- UPDATE SET WHERE 

-- Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors" using a single query.
UPDATE inventory 
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior') WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Use an inner join to select the make and model fields from the inventory table and the classification name field 
-- from the classification table for inventory items that belong to the "Sport" category.
-- Advice: Take note of the variable of the inclusions with the table followed by the column type.
SELECT i.inv_make, i.inv_model, c.classification_name FROM INVENTORY i 
INNER JOIN classification c ON i.classification_id = c.classification_id WHERE classification_name = 'Sport';


-- Update all records in the inventory table to add "/vehicles" to the middle of the file path in the inv_image and inv_thumbnail columns using a single query.
UPDATE inventory SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'), inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');


-- Read from the inventory table.
SELECT * FROM INVENTORY;
