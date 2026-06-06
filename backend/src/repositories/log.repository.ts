// Import du modèle MongoDB permettant de gérer les journaux d'activité.
// ActivityAction est un type représentant les actions possibles
// (connexion, création de groupe, suppression, etc.).
import {
  ActivityLogModel,
  type ActivityAction,
} from "../models/activityLog.model";

// Import du modèle MongoDB dédié aux événements de sécurité.
// SecurityEvent représente les différents événements de sécurité
// pouvant être enregistrés dans l'application.
import {
  SecurityLogModel,
  type SecurityEvent,
} from "../models/securityLog.model";

/**
 * Interface de base utilisée par tous les types de logs.
 *
 * Ces informations permettent d'identifier :
 * - l'utilisateur concerné
 * - son adresse IP
 * - son navigateur ou appareil
 */
interface BaseLogData {
  // Utilisateur associé à l'événement
  userId?: number | undefined;

  // Adresse IP ayant déclenché l'action
  ipAddress?: string | undefined;

  // Informations du navigateur/client
  userAgent?: string | undefined;
}

/**
 * Interface décrivant les données nécessaires
 * à l'enregistrement d'un journal d'activité.
 */
interface ActivityLogData extends BaseLogData {
  // Action effectuée dans l'application
  action: ActivityAction;

  // Type de ressource concernée
  // Exemple : "GROUP", "USER", "SKILL"
  targetType?: string | undefined;

  // Identifiant de la ressource concernée
  targetId?: string | number | undefined;
}

/**
 * Interface décrivant les données nécessaires
 * à l'enregistrement d'un journal de sécurité.
 */
interface SecurityLogData extends BaseLogData {
  // Adresse email concernée par l'événement
  email?: string | undefined;

  // Type d'événement de sécurité
  event: SecurityEvent;

  // Motif ou description complémentaire
  reason?: string | undefined;
}

/**
 * Repository chargé de centraliser
 * toutes les opérations liées aux journaux.
 *
 * Deux catégories de logs sont gérées :
 * - Activity Logs (actions métier)
 * - Security Logs (événements de sécurité)
 */
export const logRepository = {
  /**
   * Crée un journal d'activité.
   *
   * Exemple d'actions enregistrées :
   * - création de groupe
   * - suppression de compte
   * - modification de profil
   * - inscription
   *
   * Les propriétés optionnelles sont ajoutées
   * uniquement lorsqu'elles existent.
   *
   * @param data Données du journal d'activité
   */
  createActivityLog(data: ActivityLogData) {
    return ActivityLogModel.create({
      // Action réalisée
      action: data.action,

      // Ajout conditionnel de l'identifiant utilisateur
      ...(data.userId !== undefined ? { userId: data.userId } : {}),

      // Type d'entité concernée
      ...(data.targetType !== undefined ? { targetType: data.targetType } : {}),

      // Identifiant de l'entité concernée
      ...(data.targetId !== undefined ? { targetId: data.targetId } : {}),

      // Adresse IP du client
      ...(data.ipAddress !== undefined ? { ipAddress: data.ipAddress } : {}),

      // Informations du navigateur
      ...(data.userAgent !== undefined ? { userAgent: data.userAgent } : {}),
    });
  },

  /**
   * Crée un journal de sécurité.
   *
   * Exemple :
   * - tentative de connexion échouée
   * - compte verrouillé
   * - changement de mot de passe
   * - activité suspecte
   *
   * @param data Données du journal de sécurité
   */
  createSecurityLog(data: SecurityLogData) {
    return SecurityLogModel.create({
      // Type d'événement de sécurité
      event: data.event,

      // Utilisateur concerné
      ...(data.userId !== undefined ? { userId: data.userId } : {}),

      // Adresse email concernée
      ...(data.email !== undefined ? { email: data.email } : {}),

      // Motif ou détail de l'événement
      ...(data.reason !== undefined ? { reason: data.reason } : {}),

      // Adresse IP utilisée
      ...(data.ipAddress !== undefined ? { ipAddress: data.ipAddress } : {}),

      // Informations du navigateur
      ...(data.userAgent !== undefined ? { userAgent: data.userAgent } : {}),
    });
  },

  /**
   * Récupère les 100 derniers journaux d'activité.
   *
   * Les résultats sont :
   * - triés du plus récent au plus ancien
   * - convertis en objets JavaScript simples grâce à lean()
   *
   * L'utilisation de lean() améliore les performances
   * car Mongoose ne crée pas d'instances complètes de documents.
   */
  findActivityLogs() {
    return ActivityLogModel.find().sort({ createdAt: -1 }).limit(100).lean();
  },

  /**
   * Récupère les 100 derniers journaux de sécurité.
   *
   * Les événements les plus récents apparaissent en premier.
   *
   * Cette méthode est généralement utilisée
   * dans un tableau de bord administrateur
   * ou un système d'audit.
   */
  findSecurityLogs() {
    return SecurityLogModel.find().sort({ createdAt: -1 }).limit(100).lean();
  },
};
