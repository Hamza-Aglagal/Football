const sql = require('mssql');
const config = require('./Config');





async function getConnection() {
  try {
    const pool = await sql.connect(config);
    console.error('database connected !');
    return pool;

  } catch (err) {
    console.error('Erreur de connexion a la base de donnees:', err);
  }
}




module.exports = getConnection; 