const DB = require('../Config/Database')
const sql = require('mssql')



exports.getCategory = async (req, res) => {
    try {
        const pool = await DB();
        const result = await pool.request().query('SELECT * FROM Categorie')
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Erreur lors de la récupération des données');
    }
};


exports.createCategory = async (req, res) => {
    try {
        const pool = await DB();
        const { NomMatch, NBRJoueurs, mi_temps, nb_mi } = req.body;

        const query = `
            INSERT INTO Categorie (NomMatch, NBRJoueurs, mi_temps, nb_mi)
            VALUES (@NomMatch, @NBRJoueurs, @mi_temps, @nb_mi)
        `;

        const result = await pool.request()
            .input('NomMatch', sql.NVarChar, NomMatch)
            .input('NBRJoueurs', sql.NVarChar, NBRJoueurs)
            .input('mi_temps', sql.Int, mi_temps)
            .input('nb_mi', sql.Int, nb_mi)
            .query(query);

        console.log(result);
        res.status(201).send('Category created!');

    } catch (err) {
        console.error("Erreur lors de la création de category :", err);
        res.status(500).send("Erreur lors de la création de category");
    }
};

