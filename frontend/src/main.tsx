/**
 * ==========================================================
 * POINT D'ENTRÉE DE L'APPLICATION REACT
 * ==========================================================
 *
 * Ce fichier est le premier exécuté lorsque
 * l'application SkillBridge démarre.
 *
 * Son rôle est de :
 * - initialiser React
 * - créer la racine de rendu
 * - charger les styles globaux
 * - monter le composant App
 * - activer les vérifications StrictMode
 */

/**
 * Bibliothèque React.
 *
 * Nécessaire pour utiliser :
 * - JSX
 * - React.StrictMode
 * - les composants React
 */
import React from "react";

/**
 * Bibliothèque ReactDOM.
 *
 * Permet d'afficher les composants React
 * dans le DOM du navigateur.
 */
import ReactDOM from "react-dom/client";

/**
 * Composant racine de l'application.
 *
 * Contient :
 * - React Router
 * - les layouts
 * - les pages
 * - les routes protégées
 */
import App from "./App";

/**
 * Importation des styles globaux.
 *
 * Ce fichier contient généralement :
 * - TailwindCSS
 * - styles généraux
 * - variables CSS
 * - reset navigateur
 */
import "./index.css";

/**
 * ==========================================================
 * CRÉATION DE LA RACINE REACT
 * ==========================================================
 *
 * Recherche l'élément HTML :
 *
 * <div id="root"></div>
 *
 * présent dans index.html.
 *
 * Le "!" indique à TypeScript que l'élément
 * existe forcément et ne sera jamais null.
 */
ReactDOM.createRoot(document.getElementById("root")!)

  /**
   * ==========================================================
   * RENDU DE L'APPLICATION
   * ==========================================================
   */
  .render(
    /**
     * StrictMode est un outil de développement.
     *
     * Il permet de détecter :
     * - les effets secondaires dangereux
     * - les API obsolètes
     * - certains bugs React
     * - les mauvaises pratiques
     *
     * StrictMode n'a aucun impact en production.
     */
    <React.StrictMode>
      {/**
       * Composant principal de SkillBridge.
       *
       * Contient :
       * RouterProvider
       * AppRouter
       * Toutes les pages de l'application
       */}
      <App />
    </React.StrictMode>,
  );
