// Import de l'application Express configurée.
//
// Ce fichier contient :
// - les middlewares
// - les routes
// - la gestion des erreurs
// - la configuration générale de l'API
import { app } from "./app";

// Import des variables d'environnement.
//
// Permet notamment d'accéder à :
// - PORT
// - FRONTEND_URL
// - JWT_SECRET
// - autres paramètres de configuration
import { env } from "./config/env";

// Fonction de connexion à MongoDB.
//
// Elle établit la connexion Mongoose avant
// le démarrage du serveur HTTP.
import { connectMongoDB } from "./config/mongodb";

/**
 * Fonction principale de démarrage du serveur.
 *
 * Cette fonction exécute toutes les étapes
 * nécessaires avant que l'application puisse
 * recevoir des requêtes.
 */
const startServer = async (): Promise<void> => {
  /**
   * ====================================
   * Connexion à MongoDB
   * ====================================
   *
   * Cette étape est exécutée avant le lancement
   * du serveur afin de garantir que la base MongoDB
   * est disponible.
   *
   * Si la connexion échoue :
   * - une exception est levée
   * - le serveur ne démarre pas
   */
  await connectMongoDB();

  /**
   * ====================================
   * Démarrage du serveur HTTP
   * ====================================
   *
   * L'application Express commence à écouter
   * les requêtes entrantes sur le port défini
   * dans les variables d'environnement.
   */
  app.listen(Number(env.port), () => {
    /**
     * Message affiché dans la console
     * lorsque le serveur est opérationnel.
     */
    console.log(`Server running on port ${env.port}`);
  });
};

/**
 * ====================================
 * Point d'entrée de l'application
 * ====================================
 *
 * Lance la procédure de démarrage :
 *
 * 1. Connexion MongoDB
 * 2. Démarrage Express
 * 3. Écoute des requêtes HTTP
 */
startServer();
