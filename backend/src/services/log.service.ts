// Import du type représentant les actions métier
// enregistrées dans les logs d'activité.
//
// Exemples :
// - REGISTER
// - LOGIN
// - JOIN_GROUP
// - CREATE_SESSION
import type { ActivityAction } from "../models/activityLog.model";

// Import du type représentant les événements de sécurité.
//
// Exemples :
// - LOGIN_FAILED
// - LOGIN_SUCCESS
// - ACCOUNT_DISABLED
import type { SecurityEvent } from "../models/securityLog.model";

// Repository responsable de l'accès aux collections MongoDB
// contenant les journaux d'activité et de sécurité.
import { logRepository } from "../repositories/log.repository";

/**
 * Contexte associé à un événement.
 *
 * Ces informations sont optionnelles
 * et servent principalement à l'audit,
 * à la traçabilité et à la sécurité.
 */
interface LogContext {
  /**
   * Identifiant de l'utilisateur concerné.
   */
  userId?: number | undefined;

  /**
   * Adresse email concernée.
   *
   * Utilisée notamment lorsqu'aucun utilisateur
   * n'est encore identifié (échec de connexion).
   */
  email?: string | undefined;

  /**
   * Adresse IP du client.
   *
   * Permet :
   * - l'audit
   * - la détection d'activités suspectes
   * - l'analyse de sécurité
   */
  ipAddress?: string | undefined;

  /**
   * User-Agent du navigateur ou du client.
   *
   * Permet d'identifier :
   * - le navigateur
   * - le système d'exploitation
   * - certains robots ou scripts automatisés
   */
  userAgent?: string | undefined;
}

/**
 * Service de journalisation.
 *
 * Centralise tous les enregistrements
 * liés :
 * - aux actions métier
 * - aux événements de sécurité
 *
 * Cela évite que les autres services
 * accèdent directement au repository.
 */
export const logService = {
  /**
   * Enregistre une activité métier.
   *
   * Exemples :
   * - inscription
   * - connexion
   * - création de groupe
   * - participation à une session
   *
   * @param action Type d'action réalisée
   * @param context Contexte utilisateur
   * @param targetType Type de ressource ciblée
   * @param targetId Identifiant de la ressource ciblée
   */
  async activity(
    action: ActivityAction,
    context: LogContext,
    targetType?: string,
    targetId?: string | number,
  ) {
    // Création d'une entrée dans la collection
    // des logs d'activité.
    return logRepository.createActivityLog({
      // Utilisateur à l'origine de l'action
      userId: context.userId,

      // Action effectuée
      action,

      // Type de ressource impactée
      targetType,

      // Identifiant de la ressource impactée
      targetId,

      // Informations réseau
      ipAddress: context.ipAddress,

      // Informations client
      userAgent: context.userAgent,
    });
  },

  /**
   * Enregistre un événement de sécurité.
   *
   * Exemples :
   * - LOGIN_FAILED
   * - LOGIN_SUCCESS
   * - ACCOUNT_DISABLED
   *
   * @param event Événement de sécurité
   * @param context Contexte utilisateur
   * @param reason Motif détaillé
   */
  async security(event: SecurityEvent, context: LogContext, reason?: string) {
    // Création d'une entrée dans la collection
    // des logs de sécurité.
    return logRepository.createSecurityLog({
      // Utilisateur concerné
      userId: context.userId,

      // Email concerné
      email: context.email,

      // Type d'événement
      event,

      // Raison détaillée éventuelle
      reason,

      // Adresse IP du client
      ipAddress: context.ipAddress,

      // Informations navigateur / client
      userAgent: context.userAgent,
    });
  },

  /**
   * Retourne les derniers journaux d'activité.
   *
   * Utilisé principalement
   * par les fonctionnalités d'administration.
   */
  async getActivityLogs() {
    return logRepository.findActivityLogs();
  },

  /**
   * Retourne les derniers journaux de sécurité.
   *
   * Utilisé principalement
   * pour l'audit et la surveillance.
   */
  async getSecurityLogs() {
    return logRepository.findSecurityLogs();
  },
};
