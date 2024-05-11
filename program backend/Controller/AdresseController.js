const DB = require('../Config/Database')
const sql = require('mssql')



exports.getAdresses = async (req, res) => {
    try {
        const pool = await DB();
        const result = await pool.request().query('SELECT * FROM Adresse')
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Erreur lors de la récupération des données');
    }
};


exports.createAdresse = async (req, res) => {
    try {
        const pool = await DB();
        const { rue, ville, codePostal, serie } = req.body;

        const query = `
            INSERT INTO Adresse (rue, ville, codePostal, serie)
            VALUES (@rue,@ville, @codePostal , @serie)
        `;

        const result = await pool.request()
            .input('rue', sql.NVarChar, rue)
            .input('ville', sql.NVarChar, ville)
            .input('codePostal', sql.NVarChar, codePostal)
            .input('serie', sql.NVarChar, serie)
            .query(query);
        console.log(result);
        res.status(201).send('Adresse created !');
        
    } catch (err) {
        console.error("Erreur lors de la création de l'adresse :", err);
        res.status(500).send("Erreur lors de la création de l'adresse");
    }
};

