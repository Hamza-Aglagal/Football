const DB = require('../Config/Database')
const sql = require('mssql')



exports.index = async (req, res) => {
    try {
        const pool = await DB();
        const result = await pool.request().query('SELECT * FROM Joueur');
        res.json(result.recordset);
    } catch (err) {
        console.error("Erreur lors de la récupération des joueurs :", err);
        res.status(500).send('Erreur lors de la récupération des joueurs');
    }
};


exports.store = async (req, res) => {
    try {
        const pool = await DB();
        const { nom, prenom, email, numero, role, avatar, adresse_id, stat_id } = req.body;

        const query = `
            INSERT INTO Joueur (nom, prenom, email, numero, role, avatar, adresse_id, stat_id)
            VALUES (@nom, @prenom, @email, @numero, @role, @avatar, @adresse_id, @stat_id)
        `;

        const result = await pool.request()
            .input('nom', sql.NVarChar, nom)
            .input('prenom', sql.NVarChar, prenom)
            .input('email', sql.NVarChar, email)
            .input('numero', sql.NVarChar, numero)
            .input('role', sql.NVarChar, role)
            .input('avatar', sql.NVarChar, avatar)
            .input('adresse_id', adresse_id ? sql.Int : sql.NVarChar, adresse_id || null)
            .input('stat_id', stat_id ? sql.Int : sql.NVarChar, stat_id || null)
            .query(query);

        console.log(result);
        res.status(201).send('Joueur créé !');

    } catch (err) {
        console.error("Erreur lors de la création du joueur :", err);
        res.status(500).send("Erreur lors de la création du joueur");
    }
};



exports.getJoueurById = async (req, res) => {
    try {
        const pool = await DB();
        const { id } = req.params; 
        
        const query = `
            SELECT * FROM Joueur WHERE id = @id
        `;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(query);

        if (result.recordset.length === 0) {
            res.status(404).send('Joueur non trouvé');
        } else {
            res.json(result.recordset[0]);
        }
    } catch (err) {
        console.error("Erreur lors de la récupération du joueur :", err);
        res.status(500).send('Erreur lors de la récupération du joueur');
    }
};