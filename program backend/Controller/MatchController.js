const DB = require('../Config/Database')
const sql = require('mssql')


exports.index = async (req, res) => {
    try {
        const pool = await DB();
        const result = await pool.request().query('SELECT * FROM Match');
        res.json(result.recordset);
    } catch (err) {
        console.error("Erreur lors de la récupération des matchs :", err);
        res.status(500).send('Erreur lors de la récupération des matchs');
    }
};

exports.store = async (req, res) => {
    try {
        const pool = await DB();
        const { equipe_1, equipe_2, dateJouer, heure_debut, heure_fin, static_id, category_id } = req.body;

        // Récupération de l'heure au format 'hh:mm:ss'
        const heureDebutFormatted = new Date(heure_debut).toLocaleTimeString('en-US', { hour12: false });
        const heureFinFormatted = new Date(heure_fin).toLocaleTimeString('en-US', { hour12: false });

        const checkMatchQuery = `
            SELECT * FROM Match
            WHERE equipe_1 = @equipe_1 AND equipe_2 = @equipe_2 AND dateJouer = @dateJouer
        `;

        const checkMatchResult = await pool.request()
            .input('equipe_1', sql.Int, equipe_1)
            .input('equipe_2', sql.Int, equipe_2)
            .input('dateJouer', sql.Date, dateJouer)
            .query(checkMatchQuery);

        if (checkMatchResult.recordset.length > 0) {
            return res.status(400).send('Un match avec ces équipes et cette date existe déjà.');
        }

        const query = `
            INSERT INTO Match (equipe_1, equipe_2, heure_debut, heure_fin, dateJouer, static_id, category_id)
            VALUES (@equipe_1, @equipe_2, @heure_debut, @heure_fin, @dateJouer, @static_id, @category_id)
        `;

        const result = await pool.request()
            .input('equipe_1', sql.Int, equipe_1)
            .input('equipe_2', sql.Int, equipe_2)
            .input('heure_debut', sql.Time, heureDebutFormatted)
            .input('heure_fin', sql.Time, heureFinFormatted)
            .input('dateJouer', sql.Date, dateJouer)
            .input('static_id', static_id ? sql.Int : sql.NVarChar, static_id || null)
            .input('category_id', sql.Int, category_id)
            .query(query);

        console.log(result);
        res.status(201).send('Match créé !');

    } catch (err) {
        console.error("Erreur lors de la création du match :", err);
        res.status(500).send("Erreur lors de la création du match");
    }
};



exports.getMatchById = async (req, res) => {
    try {
        const pool = await DB();
        const { id } = req.params;

        const query = `
            SELECT * FROM Match WHERE id = @id
        `;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(query);

        if (result.recordset.length === 0) {
            res.status(404).send('Match non trouvé');
        } else {
            res.json(result.recordset[0]);
        }
    } catch (err) {
        console.error("Erreur lors de la récupération du match :", err);
        res.status(500).send('Erreur lors de la récupération du match');
    }
};