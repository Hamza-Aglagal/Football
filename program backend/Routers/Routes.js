const express = require('express');
const router = express.Router();


const AdresseController = require('../Controller/AdresseController');
const CategoryController = require('../Controller/CategoryController');
const StaticController = require('../Controller/StatistiquesController');
const JoueurController = require('../Controller/JoueurController');
const EquipeController = require('../Controller/EquipeController');
const LigneEquipeController = require('../Controller/LigneEquipeController');
const MatchController = require('../Controller/MatchController');
const TournoiController = require('../Controller/TournoisControlle');
const AdminsTournoisController = require('../Controller/AdminsTournoisController');
const EquipeTournoisController = require('../Controller/EquipeTournoisController');
const ConversationController = require('../Controller/ConversationController');

const AuthController = require('../Controller/AuthController');



//Auth 
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);



// Adresse  
router.get('/adresses', AdresseController.getAdresses);
router.post('/create-adresse', AdresseController.createAdresse);


// Category 
router.get('/categories', CategoryController.getCategory);
router.post('/create-category', CategoryController.createCategory);



// Statistiques 
router.get('/Statistiques', StaticController.getStatistiques);
router.post('/create-static', StaticController.createStatistiques);



// Joueur 
router.get('/Joueurs', JoueurController.index);
router.post('/create-joueur', JoueurController.store);
router.get('/get-joueur/:id', JoueurController.getJoueurById);


// Equipe 
router.get('/Equipes', EquipeController.index);
router.post('/create-equipe', EquipeController.store);
router.get('/get-equipe/:id', EquipeController.getEquipeById);



// Ligne_Equipe 
router.post('/create-ligne_equipe', LigneEquipeController.store);
router.get('/get-equipes-of-joueur/:id', LigneEquipeController.getAllEquipeOFJoueurId);
router.get('/get_allJoueur_of_aquipe/:id', LigneEquipeController.getAllJoueurByEquipeId);



// Match 
router.get('/Matchs', MatchController.index);
router.post('/create-Match', MatchController.store);
router.get('/get-Match/:id', MatchController.getMatchById);
 


// Tournois
router.get('/Tournois', TournoiController.index);
router.post('/create-tournoi', TournoiController.store);
router.get('/get-tournoi/:id', TournoiController.getTournoiById);



// Admins_Tournois
router.get('/admins_tournois', AdminsTournoisController.index);
router.post('/create-Admins_tournois', AdminsTournoisController.store);
router.get('/get-Admins_tournois/:id', AdminsTournoisController.getAdminTournoiById);
router.get('/get-all-Admins-tournoi/:id', AdminsTournoisController.getAllAdminofTournoiId);



// Equipe_Tournois
router.post('/add-equipe-tournois', EquipeTournoisController.AddEquipeTotournoi);
router.get('/get-all-equipes-tournois/:id', EquipeTournoisController.getAllEquipeByTournoiId);


// Conversation 
router.get('/conversations', ConversationController.index);
router.post('/create-conversation', ConversationController.store);
router.get('/all-conversation-Joueur/:id', ConversationController.getAllConversationOfJoueurId);













module.exports = router;