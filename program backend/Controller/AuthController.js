const DB = require('../Config/Database')
const sql = require('mssql')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



exports.register = async (req, res) => {
    const { nom, prenom, email, password } = req.body;
    try {
        const pool = await DB();

        const userExists = await pool.request()
            .input('email', sql.NVarChar(255), email)
            .query(`SELECT id FROM Joueur WHERE email = @email;`);

        if (userExists.recordset.length > 0) {
            return res.status(400).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.request()
            .input('nom', sql.NVarChar(255), nom)
            .input('prenom', sql.NVarChar(255), prenom)
            .input('email', sql.NVarChar(255), email)
            .input('password', sql.NVarChar(255), hashedPassword)
            .query(`INSERT INTO Joueur (nom, prenom, email, password) 
                    VALUES (@nom, @prenom, @email, @password);`);

        res.json({ message: 'Registration successful' });
    } catch (err) {
        res.status(500).send('Server error');
    }
};







exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const pool = await DB();
        const result = await pool.request()
            .input('email', sql.NVarChar(255), email)
            .query(`SELECT id, nom, prenom, email, role, avatar, adresse_id, stat_id, password FROM Joueur WHERE email = @email;`);


        if (result.recordset.length > 0) {
            const joueur = result.recordset[0];

            const passwordIsValid = await bcrypt.compare(password, joueur.password);

            if (passwordIsValid) {

                const token = jwt.sign(
                    { joueurId: joueur.id, email: joueur.email, role: joueur.role },
                    "ddf2550c10d1bbe3f2c40747c2b190f0d0e0bb08998b26489c4707adbaf9c4a7",
                    { expiresIn: '1h' }
                );



                res.json({
                    nom: joueur.nom,
                    prenom: joueur.prenom,
                    email: joueur.email,
                    role: joueur.role,
                    avatar: joueur.avatar,
                    adresse_id: joueur.adresse_id,
                    token: token,
                    message: 'Login successful'
                });
            } else {
                res.status(401).send('Invalid credentials. Please check your password.');
            }
        } else {
            res.status(404).send('Email does not exist. Please register.');
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
};


