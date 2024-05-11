const DB = require('../Config/Database')
const sql = require('mssql')





 

exports.AddEquipeTotournoi = async (req, res) => {
    try {
        const { Tournois_id, Equipe_id } = req.body;
        const pool = await DB();

        const checkAssociationQuery = `
            SELECT * FROM Equipe_Tournois
            WHERE Tournois_id = @Tournois_id AND Equipe_id = @Equipe_id
        `;

        const checkAssociationResult = await pool.request()
            .input('Tournois_id', sql.Int, Tournois_id)
            .input('Equipe_id', sql.Int, Equipe_id)
            .query(checkAssociationQuery);

        if (checkAssociationResult.recordset.length > 0) {
            return res.status(400).send("Equipe  tournoi et l'équipe existe déjà.");
        }

        const insertQuery = `
            INSERT INTO Equipe_Tournois (Tournois_id, Equipe_id)
            VALUES (@Tournois_id, @Equipe_id)
        `;

        await pool.request()
            .input('Tournois_id', sql.Int, Tournois_id)
            .input('Equipe_id', sql.Int, Equipe_id)
            .query(insertQuery);

        res.status(201).send(" l'équipe Tournoi créée avec succès.");
    } catch (err) {
        console.error("Erreur lors de la création de l'association entre le tournoi et l'équipe :", err);
        res.status(500).send("Erreur lors de la création de l'association entre le tournoi et l'équipe");
    }
};



exports.getAllEquipeByTournoiId = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await DB();

        const query = `
            SELECT E.*
            FROM Equipe_Tournois ET
            INNER JOIN Equipe E ON ET.Equipe_id = E.id
            WHERE ET.Tournois_id = @id
        `;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(query);

        res.json(result.recordset);
    } catch (err) {
        console.error("Erreur lors de la récupération des équipes du tournoi :", err);
        res.status(500).send('Erreur lors de la récupération des équipes du tournoi');
    }
};
