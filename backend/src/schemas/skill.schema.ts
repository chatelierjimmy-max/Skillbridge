// Import de la bibliothèque Zod.
// Elle permet de valider les données reçues dans les requêtes HTTP
// avant leur traitement par les contrôleurs.
import { z } from "zod";

/**
 * ====================================
 * Validation de l'ajout d'une compétence
 * ====================================
 *
 * Utilisé par :
 * POST /users/me/skills
 *
 * Ce schéma valide les informations nécessaires
 * pour associer une compétence à un utilisateur.
 */
export const addUserSkillSchema = z.object({
  /**
   * Validation du corps de la requête HTTP.
   */
  body: z.object({
    /**
     * Identifiant de la compétence.
     *
     * Correspond à une entrée existante
     * dans la table Skill.
     *
     * Contraintes :
     * - nombre
     * - entier
     * - strictement positif
     *
     * Exemple :
     * skillId: 5
     */
    skillId: z.number().int().positive(),

    /**
     * Niveau de maîtrise associé à la compétence.
     *
     * Valeurs autorisées :
     * - BEGINNER
     * - INTERMEDIATE
     * - ADVANCED
     *
     * Exemple :
     * level: "INTERMEDIATE"
     */
    level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  }),
});

/**
 * ====================================
 * Validation d'un identifiant de compétence
 * ====================================
 *
 * Utilisé par :
 * DELETE /users/me/skills/:skillId
 *
 * Ce schéma valide le paramètre skillId
 * présent dans l'URL.
 */
export const skillIdParamSchema = z.object({
  /**
   * Validation de req.params.
   */
  params: z.object({
    /**
     * Identifiant de la compétence.
     *
     * z.coerce.number()
     * permet de convertir automatiquement
     * la chaîne reçue dans l'URL en nombre.
     *
     * Exemple :
     * "3" → 3
     */
    skillId: z.coerce
      .number()

      // Vérifie qu'il s'agit d'un entier
      .int()

      // Vérifie qu'il est strictement positif
      .positive(),
  }),
});
