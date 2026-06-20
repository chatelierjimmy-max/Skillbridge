import http from "http";
import { Server } from "socket.io";

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

  const httpServer = http.createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: env.frontendUrl,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", ({ roomId, userId }) => {
      socket.join(roomId);

      socket.to(roomId).emit("user-joined", {
        userId,
        socketId: socket.id,
      });

      socket.on("offer", (payload) => {
        socket.to(payload.target).emit("offer", {
          ...payload,
          socketId: socket.id,
        });
      });

      socket.on("answer", (payload) => {
        socket.to(payload.target).emit("answer", {
          ...payload,
          socketId: socket.id,
        });
      });

      socket.on("ice-candidate", (payload) => {
        socket.to(payload.target).emit("ice-candidate", {
          ...payload,
          socketId: socket.id,
        });
      });

      socket.on("disconnect", () => {
        socket.to(roomId).emit("user-left", {
          socketId: socket.id,
        });
      });
    });
  });

  httpServer.listen(Number(env.port), "0.0.0.0", () => {
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
