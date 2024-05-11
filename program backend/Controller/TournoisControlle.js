const DB = require('../Config/Database')
const sql = require('mssql')


exports.index = async (req, res) => {
    try {
        const pool = await DB();
        const result = await pool.request().query('SELECT * FROM Tournois');
        res.json(result.recordset);
    } catch (err) {
        console.error("Erreur lors de la récupération des Tournois :", err);
        res.status(500).send('Erreur lors de la récupération des Tournois');
    }
};




exports.store = async (req, res) => {
    try {
        const pool = await DB();
        const { name, dateDebut, logo, dateFin, equipeWin, adresse } = req.body;

        const checkTournoiQuery = `
            SELECT * FROM Tournois
            WHERE name = @name AND dateDebut = @dateDebut
        `;
        const checkTournoiResult = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('dateDebut', sql.Date, dateDebut)
            .query(checkTournoiQuery);

        if (checkTournoiResult.recordset.length > 0) {
            return res.status(400).send('Un tournoi avec ce nom et cette date de début existe déjà.');
        }

        const query = `
            INSERT INTO Tournois (name, dateDebut, logo, dateFin, equipeWin, adresse)
            VALUES (@name, @dateDebut, @logo, @dateFin, @equipeWin, @adresse)
        `;
        const result = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('dateDebut', sql.Date, dateDebut)
            .input('logo', sql.NVarChar, logo)
            .input('dateFin', sql.Date, dateFin)
            .input('equipeWin', equipeWin ? sql.Int : sql.NVarChar, equipeWin || null)
            .input('adresse', sql.Int, adresse)
            .query(query);

        console.log(result);
        res.status(201).send('Tournoi créé !');

    } catch (err) {
        console.error("Erreur lors de la création du tournoi :", err);
        res.status(500).send("Erreur lors de la création du tournoi");
    }
};




exports.getTournoiById = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await DB();

        const query = `
            SELECT * FROM Tournois WHERE id = @id
        `;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(query);

        if (result.recordset.length === 0) {
            res.status(404).send('Tournoi non trouvé');
        } else {
            res.json(result.recordset[0]);
        }
    } catch (err) {
        console.error("Erreur lors de la récupération du tournoi :", err);
        res.status(500).send('Erreur lors de la récupération du tournoi');
    }
};