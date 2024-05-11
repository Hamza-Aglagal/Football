const DB = require('../Config/Database')
const sql = require('mssql')



exports.index = async (req, res) => {
    try {
        const pool = await DB();
        const result = await pool.request().query('SELECT * FROM Equipe');
        res.json(result.recordset);
    } catch (err) {
        console.error("Erreur lors de la récupération d' Equipe :", err);
        res.status(500).send('Erreur lors de la récupération d\'Equipe');
    }
};


exports.store = async (req, res) => {
    try {
        const pool = await DB();
        const { nom, logo, dateCreation, adresse_id, admin, statistiques_id } = req.body;

        const query = `
            INSERT INTO Equipe (nom, logo, dateCreation, adresse_id, admin, statistiques_id)
            VALUES (@nom, @logo, @dateCreation, @adresse_id, @admin, @statistiques_id)
        `;

        const result = await pool.request()
            .input('nom', sql.NVarChar, nom)
            .input('logo', sql.NVarChar, logo)
            .input('dateCreation', sql.Date, dateCreation)
            .input('adresse_id', adresse_id ? sql.Int : sql.NVarChar, adresse_id || null)
            .input('admin', admin ? sql.Int : sql.NVarChar, admin || null)
            .input('statistiques_id', statistiques_id ? sql.Int : sql.NVarChar, statistiques_id || null)
            .query(query);

        console.log(result);
        res.status(201).send('Équipe créée !');

    } catch (err) {
        console.error("Erreur lors de la création de l'équipe :", err);
        res.status(500).send("Erreur lors de la création de l'équipe");
    }
};



exports.getEquipeById = async (req, res) => {
    try {
        const pool = await DB();
        const { id } = req.params; 
        
        const query = `
            SELECT * FROM Equipe WHERE id = @id
        `;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(query);

        if (result.recordset.length === 0) {
            res.status(404).send('Équipe non trouvée');
        } else {
            res.json(result.recordset[0]);
        }
    } catch (err) {
        console.error("Erreur lors de la récupération de l'équipe :", err);
        res.status(500).send('Erreur lors de la récupération de l\'équipe');
    }
};