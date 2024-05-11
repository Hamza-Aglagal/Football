const DB = require('../Config/Database')
const sql = require('mssql')



exports.index = async (req, res) => {
    try {
        const pool = await DB();
        const result = await pool.request().query('SELECT * FROM Conversation');
        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching conversations:", err);
        res.status(500).send('Error fetching conversations');
    }
};



exports.store = async (req, res) => {
    try {
        const pool = await DB();
        const { dateCreation, recepteur, destinateur } = req.body;

       
        const checkConversationQuery = `
            SELECT * FROM Conversation
            WHERE (recepteur = @recepteur AND destinateur = @destinateur)
            OR (recepteur = @destinateur AND destinateur = @recepteur)
        `;
        const checkConversationResult = await pool.request()
            .input('recepteur', sql.Int, recepteur)
            .input('destinateur', sql.Int, destinateur)
            .query(checkConversationQuery);

        if (checkConversationResult.recordset.length > 0) {
           
            return res.status(400).send('Conversation existe deja !');
        }

       
        const query = `
            INSERT INTO Conversation (dateCreation, recepteur, destinateur)
            VALUES (@dateCreation, @recepteur, @destinateur)
        `;
        const result = await pool.request()
            .input('dateCreation', sql.Date, dateCreation)
            .input('recepteur', sql.Int, recepteur)
            .input('destinateur', sql.Int, destinateur)
            .query(query);

        console.log(result);
        res.status(201).send('Conversation created !');
    } catch (err) {
        console.error("Error creating conversation:", err);
        res.status(500).send("Error creating conversation");
    }
};





exports.getAllConversationOfJoueurId = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await DB();

        const query = `
            SELECT * FROM Conversation
            WHERE recepteur = @id OR destinateur = @id
          
        `;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(query);

        if (result.recordset.length === 0) {
            res.status(404).send('Aucune conversation trouvée pour ce joueur.');
        } else {
            res.json(result.recordset);
        }
    } catch (err) {
        console.error("Erreur lors de la récupération des conversations :", err);
        res.status(500).send('Erreur lors de la récupération des conversations');
    }
};