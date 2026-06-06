// Import de la bibliothèque Zod.
// Zod permet de valider et typer les données reçues
// dans les requêtes HTTP.
import { z } from "zod";

/**
 * Schéma de validation utilisé pour les routes
 * d'administration contenant un paramètre :id.
 *
 * Exemple de route :
 *
 * PATCH /admin/users/12/disable
 * PATCH /admin/users/12/enable
 *
 * Ce schéma valide :
 * - la présence du paramètre id
 * - sa conversion en nombre
 * - qu'il s'agit d'un entier
 * - qu'il est strictement positif
 */
export const adminUserIdParamSchema = z.object({
  /**
   * Validation de req.params.
   */
  params: z.object({
    /**
     * Identifiant utilisateur.
     *
     * z.coerce.number()
     * ------------------
     * Convertit automatiquement une chaîne
     * provenant de l'URL en nombre.
     *
     * Exemple :
     * "12" → 12
     */
    id: z.coerce
      .number()

      /**
       * Vérifie que la valeur est un entier.
       *
       * Valide :
       * 12
       *
       * Refuse :
       * 12.5
       */
      .int()

      /**
       * Vérifie que la valeur est strictement positive.
       *
       * Valide :
       * 1
       * 12
       * 500
       *
       * Refuse :
       * 0
       * -5
       */
      .positive(),
  }),
});
