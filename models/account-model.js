const pool = require("../database/");

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email= $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* *****************************
* W9 Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account id using email address
* ***************************** */
async function getAccountById (account_id) {
  try {
    const result = await pool.query(
      'SELECT * FROM public.account WHERE account_id = $1',
      [account_id])
    return result.rows[0];

  } catch (error) {
    return new Error("No matching id found")
  }
}

//W9 Updating the inventory item
async function updateAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_id,
) {
  try {
    const sql =
      "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
}
async function updatePassword(
  hashedPassword,
  account_id,
) {
  try {
    const sql =
      "UPDATE account SET account_password =$1 WHERE account_id = $2 RETURNING *";
    return await pool.query(sql, [
      hashedPassword,
      account_id,
    ]);
  } catch (error) {
    return error.message;
  }
}
module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccount, updatePassword };

// /* *****************************
// * Return account id using email address
// * ***************************** */
// async function getAccountByAccountId (account_id) {
//     try {
//       // Perform the query to find the account by ID
//       const result = await pool.query(
//         'SELECT * FROM public.account WHERE account_id = $1',
//         [account_id]
//       );
  
//       // Check if a row is returned
//       if (result.rows.length === 0) {
//         // If no account found, return null (or throw an error)
//         return null;  // You could also throw an error here if you prefer
//       }
  
//       // Return the first result row (there should only be one)
//       return result.rows[0];
      
//     } catch (error) {
//       // Log the error for debugging and return a message or null
//       console.error('Error fetching account:', error);
//       return null;  // Return null to indicate the error gracefully
//     }
//   }