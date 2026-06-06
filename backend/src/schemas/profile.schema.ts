// Import de la bibliothèque Zod.
// Elle permet de valider les données reçues
// dans les requêtes HTTP avant leur traitement.
import { z } from "zod";

/**
 * ====================================
 * Validation de la mise à jour du profil
 * ====================================
 *
 * Utilisé par :
 * PUT /users/me/profile
 *
 * Ce schéma valide les informations
 * qu'un utilisateur peut modifier sur son profil.
 *
 * Tous les champs sont optionnels afin de permettre
 * des mises à jour partielles du profil.
 */
export const updateProfileSchema = z.object({
  /**
   * Validation du corps de la requête HTTP.
   */
  body: z.object({
    /**
     * Biographie de l'utilisateur.
     *
     * Champ facultatif.
     *
     * Permet à l'utilisateur de se présenter,
     * décrire ses objectifs ou son parcours.
     *
     * Limite :
     * - 1000 caractères maximum
     */
    bio: z.string().max(1000).optional(),

    /**
     * Niveau global de l'utilisateur.
     *
     * Champ facultatif.
     *
     * Valeurs autorisées :
     * - BEGINNER
     * - INTERMEDIATE
     * - ADVANCED
     *
     * L'utilisation d'un enum garantit
     * que seules les valeurs métier prévues
     * peuvent être enregistrées.
     */
    level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),

    /**
     * Disponibilités de l'utilisateur.
     *
     * Champ facultatif.
     *
     * Exemples :
     * - "Soirs et week-ends"
     * - "Lundi au vendredi après 18h"
     * - "Disponible tous les jours"
     *
     * Limite :
     * - 255 caractères maximum
     */
    availability: z.string().max(255).optional(),

    /**
     * Localisation de l'utilisateur.
     *
     * Champ facultatif.
     *
     * Exemples :
     * - "Lyon"
     * - "Paris"
     * - "Télétravail"
     *
     * Limite :
     * - 255 caractères maximum
     */
    location: z.string().max(255).optional(),
  }),
});
