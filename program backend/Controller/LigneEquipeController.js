const DB = require('../Config/Database')
const sql = require('mssql')




exports.store = async (req, res) => {
    try {
        const { equipe_id, joueur_id } = req.body;

        const pool = await DB();

        const query = `
            INSERT INTO Ligne_Equipe (equipe_id, joueur_id)
            VALUES (@equipe_id, @joueur_id)
        `;

        const result = await pool.request()
            .input('equipe_id', sql.Int, equipe_id)
            .input('joueur_id', sql.Int, joueur_id)
            .query(query);

        res.status(201).send('Ligne d\'équipe créée !');

    } catch (err) {
        console.error("Erreur lors de la création de la ligne d'équipe :", err);
        res.status(500).send("Erreur lors de la création de la ligne d'équipe");
    }
};




exports.getAllEquipeOFJoueurId = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await DB();
        const result = await pool.request()
            .input('joueurId', sql.Int, id)
            .query(`
                SELECT e.* FROM Equipe e
                INNER JOIN Ligne_Equipe le ON e.id = le.equipe_id
                WHERE le.joueur_id = @joueurId
            `);

        res.json(result.recordset);
    } catch (err) {
        console.error("Erreur lors de la récupération des équipes :", err);
        res.status(500).send("Erreur lors de la récupération des équipes");
    }
};


exports.getAllJoueurByEquipeId = async (req, res) => {
    try {
        const { id } = req.params; 
        const pool = await DB();
        const result = await pool.request()
            .input('equipeId', sql.Int, id)
            .query(`
                SELECT j.* FROM Joueur j
                INNER JOIN Ligne_Equipe le ON j.id = le.joueur_id
                WHERE le.equipe_id = @equipeId
            `);

        res.json(result.recordset);
    } catch (err) {
        console.error("Erreur lors de la récupération des joueurs :", err);
        res.status(500).send("Erreur lors de la récupération des joueurs");
    }
};