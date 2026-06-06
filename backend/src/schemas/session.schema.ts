// Import de la bibliothèque Zod.
// Elle permet de valider et transformer les données
// reçues dans les requêtes HTTP avant leur traitement.
import { z } from "zod";

/**
 * ====================================
 * Validation de la création d'une session
 * ====================================
 *
 * Utilisé par :
 * POST /groups/:groupId/sessions
 *
 * Ce schéma valide :
 * - l'identifiant du groupe
 * - les informations de la session
 */
export const createSessionSchema = z.object({
  /**
   * Validation des paramètres d'URL.
   */
  params: z.object({
    /**
     * Identifiant du groupe.
     *
     * Exemple :
     * /groups/5/sessions
     *
     * "5" → 5 grâce à z.coerce.number()
     */
    groupId: z.coerce.number().int().positive(),
  }),

  /**
   * Validation du corps de la requête.
   */
  body: z.object({
    /**
     * Titre de la session.
     *
     * Contraintes :
     * - minimum 3 caractères
     * - maximum 150 caractères
     *
     * Exemples :
     * - "Atelier React"
     * - "Découverte de Docker"
     */
    title: z.string().min(3).max(150),

    /**
     * Description de la session.
     *
     * Champ facultatif.
     *
     * Permet de détailler :
     * - le programme
     * - les objectifs
     * - les prérequis
     *
     * Limite :
     * 1000 caractères.
     */
    description: z.string().max(1000).optional(),

    /**
     * Date et heure de début.
     *
     * Doit respecter le format ISO 8601.
     *
     * Exemple valide :
     * 2025-07-15T18:00:00Z
     */
    startDate: z.string().datetime(),

    /**
     * Durée de la session.
     *
     * Généralement exprimée en minutes.
     *
     * Contraintes :
     * - minimum 15 minutes
     * - maximum 480 minutes (8 heures)
     */
    duration: z.number().int().min(15).max(480),

    /**
     * Nombre maximal de participants.
     *
     * Champ facultatif.
     *
     * Contraintes :
     * - entier
     * - strictement positif
     */
    maxParticipants: z.number().int().positive().optional(),
  }),
});

/**
 * ====================================
 * Validation d'un identifiant de groupe
 * ====================================
 *
 * Utilisé par :
 * GET /groups/:groupId/sessions
 *
 * Vérifie que groupId est un entier positif.
 */
export const groupIdParamSchema = z.object({
  params: z.object({
    groupId: z.coerce.number().int().positive(),
  }),
});

/**
 * ====================================
 * Validation d'un identifiant de session
 * ====================================
 *
 * Utilisé par :
 * POST   /sessions/:id/book
 * DELETE /sessions/:id/book
 *
 * Vérifie que l'identifiant de session
 * est valide avant d'accéder au contrôleur.
 */
export const sessionIdParamSchema = z.object({
  params: z.object({
    /**
     * Identifiant de la session.
     *
     * Exemple :
     * /sessions/12/book
     *
     * "12" → 12
     */
    id: z.coerce.number().int().positive(),
  }),
});
