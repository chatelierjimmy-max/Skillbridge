/**
 * ==========================================================
 * CONNEXION À MONGODB
 * ==========================================================
 *
 * Ce fichier est responsable de l'initialisation
 * de la connexion MongoDB au démarrage du backend.
 *
 * MongoDB est utilisé dans SkillBridge pour :
 * - la messagerie de groupe
 * - les notifications
 * - les logs d'activité
 * - les logs de sécurité
 *
 * Si la connexion échoue, le serveur est arrêté
 * afin d'éviter un fonctionnement partiel.
 */

/**
 * Importation de Mongoose.
 *
 * Mongoose est un ODM (Object Data Modeling)
 * permettant de communiquer avec MongoDB
 * à travers des modèles TypeScript.
 */
import mongoose from "mongoose";

/**
 * Importation de la configuration globale.
 *
 * Contient notamment :
 * - mongoUri
 * - databaseUrl
 * - jwtSecret
 */
import { env } from "./env";

/**
 * ==========================================================
 * FONCTION DE CONNEXION MONGODB
 * ==========================================================
 *
 * Cette fonction est appelée au démarrage
 * de l'application.
 *
 * Exemple :
 *
 * await connectMongoDB();
 */
export const connectMongoDB = async (): Promise<void> => {
  try {
    /**
     * Récupération de l'URI MongoDB
     * depuis la configuration.
     */
    const mongoUri = env.mongoUri;

    /**
     * Vérification de sécurité.
     *
     * Même si env.ts effectue déjà
     * cette validation, cette vérification
     * protège contre une utilisation
     * incorrecte future.
     */
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined");
    }

    /**
     * Connexion au serveur MongoDB.
     *
     * Exemple :
     *
     * mongodb://localhost:27017/skillbridge
     *
     * ou
     *
     * mongodb+srv://user:password@cluster.mongodb.net/skillbridge
     */
    await mongoose.connect(mongoUri);

    /**
     * Message affiché lorsque
     * la connexion est réussie.
     */
    console.log("MongoDB connected");
  } catch (error) {
    /**
     * Affichage détaillé de l'erreur.
     *
     * Exemples :
     *
     * - serveur MongoDB arrêté
     * - URI incorrecte
     * - problème réseau
     * - identifiants invalides
     */
    console.error("MongoDB connection error:", error);

    /**
     * Arrêt immédiat du processus.
     *
     * Code 1 = erreur critique.
     *
     * L'application ne doit pas démarrer
     * sans MongoDB car plusieurs fonctionnalités
     * en dépendent.
     */
    process.exit(1);
  }
};
