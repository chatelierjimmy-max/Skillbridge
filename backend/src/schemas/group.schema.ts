// Import de la bibliothèque Zod.
// Elle permet de valider les données reçues
// dans les requêtes HTTP avant leur traitement.
import { z } from "zod";

/**
 * ====================================
 * Schéma de création d'un groupe
 * ====================================
 *
 * Utilisé par :
 * POST /groups
 *
 * Ce schéma valide les informations
 * nécessaires à la création d'un groupe d'apprentissage.
 */
export const createGroupSchema = z.object({
  /**
   * Validation du corps de la requête HTTP.
   */
  body: z.object({
    /**
     * Nom du groupe.
     *
     * Contraintes :
     * - minimum 3 caractères
     * - maximum 150 caractères
     *
     * Exemples valides :
     * - "Développeurs React"
     * - "Apprentissage TypeScript"
     */
    name: z.string().min(3).max(150),

    /**
     * Description du groupe.
     *
     * Champ facultatif.
     *
     * Permet de présenter :
     * - les objectifs du groupe
     * - les thématiques abordées
     * - les règles éventuelles
     *
     * Longueur maximale :
     * 1000 caractères.
     */
    description: z.string().max(1000).optional(),

    /**
     * Niveau cible du groupe.
     *
     * Valeurs autorisées :
     * - BEGINNER
     * - INTERMEDIATE
     * - ADVANCED
     *
     * Cette restriction garantit
     * qu'aucune valeur invalide
     * ne sera enregistrée.
     */
    level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),

    /**
     * Identifiant de la compétence associée.
     *
     * Contraintes :
     * - nombre entier
     * - strictement positif
     *
     * Exemple :
     * skillId: 5
     */
    skillId: z.number().int().positive(),
  }),
});

/**
 * ====================================
 * Validation des paramètres de groupe
 * ====================================
 *
 * Utilisé par :
 *
 * GET    /groups/:id
 * POST   /groups/:id/join
 * DELETE /groups/:id/leave
 *
 * Ce schéma valide l'identifiant du groupe
 * présent dans l'URL.
 */
export const groupIdParamSchema = z.object({
  /**
   * Validation de req.params.
   */
  params: z.object({
    /**
     * Identifiant du groupe.
     *
     * z.coerce.number()
     * permet de convertir automatiquement
     * une chaîne provenant de l'URL
     * en nombre.
     *
     * Exemple :
     * "12" → 12
     */
    id: z.coerce
      .number()

      // Vérifie qu'il s'agit d'un entier
      .int()

      // Vérifie qu'il est strictement positif
      .positive(),
  }),
});
