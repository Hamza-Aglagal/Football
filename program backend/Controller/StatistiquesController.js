const DB = require('../Config/Database')
const sql = require('mssql')



exports.getStatistiques = async (req, res) => {
    try {
        const pool = await DB();
        const result = await pool.request().query('SELECT * FROM Statistiques');
        res.json(result.recordset);
    } catch (err) {
        console.error("Erreur lors de la récupération des statistiques :", err);
        res.status(500).send('Erreur lors de la récupération des données');
    }
};


exports.createStatistiques = async (req, res) => {
    try {
        const pool = await DB();
        const { butsMarques, butsEncaisses, cartonsJaunes, cartonsRouges, type_static, Niveau, resultat } = req.body;

        const query = `
            INSERT INTO Statistiques (butsMarques, butsEncaisses, cartonsJaunes, cartonsRouges, type_static, Niveau, resultat)
            VALUES (@butsMarques, @butsEncaisses, @cartonsJaunes, @cartonsRouges, @type_static, @Niveau, @resultat)
        `;

        const result = await pool.request()
            .input('butsMarques', sql.Int, butsMarques)
            .input('butsEncaisses', sql.Int, butsEncaisses)
            .input('cartonsJaunes', sql.Int, cartonsJaunes)
            .input('cartonsRouges', sql.Int, cartonsRouges)
            .input('type_static', sql.NVarChar, type_static)
            .input('Niveau', sql.NVarChar, Niveau)
            .input('resultat', sql.NVarChar, resultat)
            .query(query);

        console.log(result);
        res.status(201).send('Statistique créée !');

    } catch (err) {
        console.error("Erreur lors de la création de statistique :", err);
        res.status(500).send("Erreur lors de la création de statistique");
    }
};