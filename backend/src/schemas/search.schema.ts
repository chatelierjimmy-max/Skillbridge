// Import de la bibliothèque Zod.
// Elle permet de valider et de transformer les données
// reçues dans les requêtes HTTP.
import { z } from "zod";

/**
 * ====================================
 * Validation des filtres de recherche
 * ====================================
 *
 * Utilisé par :
 * GET /users/search
 *
 * Ce schéma valide les paramètres de requête (query string)
 * permettant de rechercher des apprenants.
 *
 * Tous les filtres sont optionnels afin de permettre :
 * - une recherche globale
 * - une recherche multicritère
 * - une recherche paginée
 */
export const searchLearnersSchema = z.object({
  /**
   * Validation de req.query.
   *
   * Exemple :
   * GET /users/search?skill=React&city=Lyon&page=1
   */
  query: z.object({
    /**
     * Nom de la compétence recherchée.
     *
     * Champ facultatif.
     *
     * Exemples :
     * - React
     * - TypeScript
     * - Docker
     *
     * Longueur maximale :
     * 100 caractères.
     */
    skill: z.string().max(100).optional(),

    /**
     * Niveau recherché.
     *
     * Champ facultatif.
     *
     * Valeurs autorisées :
     * - BEGINNER
     * - INTERMEDIATE
     * - ADVANCED
     *
     * Cette validation garantit
     * la cohérence avec l'enum Prisma Level.
     */
    level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),

    /**
     * Ville ou localisation recherchée.
     *
     * Champ facultatif.
     *
     * Exemples :
     * - Lyon
     * - Paris
     * - Marseille
     *
     * Longueur maximale :
     * 150 caractères.
     */
    city: z.string().max(150).optional(),

    /**
     * Numéro de page.
     *
     * Champ facultatif.
     *
     * z.coerce.number()
     * convertit automatiquement les valeurs
     * reçues dans l'URL.
     *
     * Exemple :
     * page=2 → 2
     *
     * Contraintes :
     * - entier
     * - strictement positif
     */
    page: z.coerce.number().int().positive().optional(),

    /**
     * Nombre maximum de résultats retournés.
     *
     * Champ facultatif.
     *
     * Exemple :
     * limit=10
     *
     * Contraintes :
     * - entier
     * - strictement positif
     * - maximum 50 résultats
     *
     * Cette limite protège :
     * - les performances
     * - la base de données
     * - l'API contre les abus
     */
    limit: z.coerce.number().int().positive().max(50).optional(),
  }),
});
