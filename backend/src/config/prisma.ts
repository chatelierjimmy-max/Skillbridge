/**
 * ==========================================================
 * CONFIGURATION DE PRISMA
 * ==========================================================
 *
 * Ce fichier initialise Prisma, l'ORM principal
 * utilisé par SkillBridge pour communiquer avec
 * la base de données relationnelle MariaDB.
 *
 * Prisma permet :
 * - d'effectuer des requêtes SQL sans écrire de SQL brut
 * - de manipuler les tables sous forme d'objets
 * - de bénéficier du typage TypeScript
 * - de simplifier les opérations CRUD
 *
 * Base concernée :
 * MariaDB
 */

/**
 * Importation du client Prisma.
 *
 * PrismaClient est la classe principale utilisée
 * pour interagir avec la base de données.
 */
import { PrismaClient } from "@prisma/client";

/**
 * Importation de l'adaptateur MariaDB.
 *
 * Cet adaptateur permet à Prisma de communiquer
 * avec une base MariaDB.
 */
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

/**
 * Importation de la configuration globale.
 *
 * Contient notamment :
 * - databaseUrl
 * - mongoUri
 * - jwtSecret
 */
import { env } from "./env";

/**
 * ==========================================================
 * CRÉATION DE L'ADAPTATEUR MARIADB
 * ==========================================================
 *
 * L'adaptateur utilise l'URL de connexion définie
 * dans le fichier .env.
 *
 * Exemple :
 *
 * DATABASE_URL=
 * mariadb://root:password@localhost:3306/skillbridge
 */
const adapter = new PrismaMariaDb(env.databaseUrl);

/**
 * ==========================================================
 * INSTANCE UNIQUE DE PRISMA
 * ==========================================================
 *
 * Cette instance sera utilisée dans toute
 * l'application pour accéder aux données.
 *
 * Exemple :
 *
 * prisma.user.findMany()
 * prisma.group.create()
 * prisma.session.update()
 */
export const prisma = new PrismaClient({
  /**
   * Association de Prisma à MariaDB
   * via l'adaptateur précédemment créé.
   */
  adapter,
});
