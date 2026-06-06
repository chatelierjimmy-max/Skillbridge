// Import de la bibliothèque Zod.
// Elle permet de valider les paramètres et les données
// envoyées dans les requêtes HTTP.
import { z } from "zod";

/**
 * ====================================
 * Validation des messages d'un groupe
 * ====================================
 *
 * Utilisé par :
 * GET /groups/:groupId/messages
 *
 * Ce schéma valide le paramètre groupId
 * présent dans l'URL.
 */
export const groupMessagesParamSchema = z.object({
  params: z.object({
    /**
     * Identifiant du groupe.
     *
     * z.coerce.number()
     * convertit automatiquement la valeur
     * reçue depuis l'URL ("5") en nombre (5).
     *
     * Contraintes :
     * - entier
     * - strictement positif
     */
    groupId: z.coerce.number().int().positive(),
  }),
});

/**
 * ====================================
 * Validation de la création d'un message
 * ====================================
 *
 * Utilisé par :
 * POST /groups/:groupId/messages
 *
 * Ce schéma valide :
 * - l'identifiant du groupe
 * - le contenu du message
 */
export const createMessageSchema = z.object({
  /**
   * Validation des paramètres d'URL.
   */
  params: z.object({
    groupId: z.coerce.number().int().positive(),
  }),

  /**
   * Validation du corps de la requête.
   */
  body: z.object({
    /**
     * Contenu du message.
     *
     * trim() :
     * Supprime les espaces inutiles au début
     * et à la fin du texte avant validation.
     *
     * Contraintes :
     * - minimum 1 caractère
     * - maximum 1000 caractères
     */
    content: z
      .string()

      // Nettoyage des espaces superflus
      .trim()

      // Empêche les messages vides
      .min(1, "Le message ne peut pas être vide")

      // Limite la taille du message
      .max(1000, "Le message ne peut pas dépasser 1000 caractères"),
  }),
});

/**
 * ====================================
 * Validation d'un identifiant de message
 * ====================================
 *
 * Utilisé par :
 * DELETE /messages/:id
 *
 * Dans MongoDB, les messages utilisent
 * généralement un ObjectId sous forme de chaîne.
 */
export const messageIdParamSchema = z.object({
  params: z.object({
    /**
     * Identifiant du message.
     *
     * Vérifie simplement que :
     * - la valeur est une chaîne
     * - elle n'est pas vide
     *
     * Exemple valide :
     * "665f8c2a7b6f3a21f0b12e89"
     */
    id: z.string().min(1, "Identifiant du message invalide"),
  }),
});
