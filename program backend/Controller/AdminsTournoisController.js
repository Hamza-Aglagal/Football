const DB = require('../Config/Database')
const sql = require('mssql')




exports.index = async (req, res) => {
    try {
        const pool = await DB();
        const result = await pool.request().query('SELECT * FROM Admins_Tournois');
        res.json(result.recordset);
    } catch (err) {
        console.error("Erreur lors de la récupération des administrateurs de tournois :", err);
        res.status(500).send('Erreur lors de la récupération des administrateurs de tournois');
    }
};

exports.store = async (req, res) => {
    try {
        const pool = await DB();
        const { tournois_id, joueur_id } = req.body;

        const checkAdminQuery = `
            SELECT * FROM Admins_Tournois
            WHERE tournois_id = @tournois_id AND joueur_id = @joueur_id
        `;
        const checkAdminResult = await pool.request()
            .input('tournois_id', sql.Int, tournois_id)
            .input('joueur_id', sql.Int, joueur_id)
            .query(checkAdminQuery);

        if (checkAdminResult.recordset.length > 0) {
            return res.status(400).send('Cet administrateur de tournoi existe déjà.');
        }

        const insertAdminQuery = `
            INSERT INTO Admins_Tournois (tournois_id, joueur_id)
            VALUES (@tournois_id, @joueur_id)
        `;
        await pool.request()
            .input('tournois_id', sql.Int, tournois_id)
            .input('joueur_id', sql.Int, joueur_id)
            .query(insertAdminQuery);

        res.status(201).send('Administrateur de tournoi créé !');

    } catch (err) {
        console.error("Erreur lors de la création de l'administrateur de tournoi :", err);
        res.status(500).send("Erreur lors de la création de l'administrateur de tournoi");
    }
};

exports.getAdminTournoiById = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await DB();

        const query = `
            SELECT * FROM Admins_Tournois WHERE id = @id
        `;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(query);

        if (result.recordset.length === 0) {
            res.status(404).send('Administrateur de tournoi non trouvé');
        } else {
            res.json(result.recordset[0]);
        }
    } catch (err) {
        console.error("Erreur lors de la récupération de l'administrateur de tournoi :", err);
        res.status(500).send("Erreur lors de la récupération de l'administrateur de tournoi");
    }
};



exports.getAllAdminofTournoiId = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await DB();

        const query = `
            SELECT A.*, J.nom, J.prenom, J.email
            FROM Admins_Tournois A
            INNER JOIN Joueur J ON A.joueur_id = J.id
            WHERE A.tournois_id = @id
        `;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(query);

        res.json(result.recordset);
    } catch (err) {
        console.error("Erreur lors de la récupération des administrateurs du tournoi :", err);
        res.status(500).send('Erreur lors de la récupération des administrateurs du tournoi');
    }
};