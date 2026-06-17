// Importation des hooks React
// useState : permet de stocker des données locales au composant
// useEffect : permet d'exécuter une action au montage du composant
// useCallback : mémorise une fonction pour éviter sa recréation inutile
import { useCallback, useEffect, useState } from "react";

// Link permet de créer des liens internes
// useParams permet de récupérer les paramètres présents dans l'URL
import { Link, useParams } from "react-router-dom";

// Importation des icônes utilisées dans la page
import { Calendar, MessageCircle, Users } from "lucide-react";

// Service responsable des appels API liés aux groupes
import { groupService } from "../../services/group.service";

// Type TypeScript décrivant le détail complet d'un groupe
import type { GroupDetail } from "../../types/group.type";

// Hook personnalisé pour récupérer l'utilisateur connecté
import { useAuth } from "../../hooks/useAuth";

// Objet utilitaire permettant d'afficher un libellé lisible pour un niveau
import { levelLabel } from "../../utils/levelLabel";

// Fonction utilitaire pour transformer une erreur API en message lisible
import { getApiErrorMessage } from "../../utils/apiError";

// Page de détail d'un groupe
export default function GroupDetailPage() {
  // Récupération du paramètre dynamique :id depuis l'URL
  // Exemple : /groups/5 => id vaut "5"
  const { id } = useParams();

  // Récupération de l'utilisateur connecté
  const { user } = useAuth();

  // Données complètes du groupe affiché
  const [group, setGroup] = useState<GroupDetail | null>(null);

  // État indiquant si la page est encore en chargement
  const [loading, setLoading] = useState(true);

  // Message de succès affiché après une action
  const [message, setMessage] = useState("");

  // Message d'erreur affiché si une action échoue
  const [error, setError] = useState("");

  // Conversion de l'id récupéré dans l'URL en nombre
  // Les paramètres d'URL sont toujours des chaînes de caractères
  const groupId = Number(id);

  /**
   * Fonction de récupération du groupe depuis l'API
   *
   * useCallback permet de stabiliser la référence de la fonction.
   * C'est utile ici car fetchGroup est utilisée dans useEffect.
   */
  const fetchGroup = useCallback(async () => {
    try {
      // Appel API pour récupérer les détails du groupe
      const data = await groupService.getGroupById(groupId);

      // Mise à jour de l'état avec les données reçues
      setGroup(data);
    } finally {
      // Fin du chargement, même si l'appel API échoue
      setLoading(false);
    }
  }, [groupId]);

  /**
   * Chargement du groupe au montage du composant
   * ou lorsque l'identifiant du groupe change.
   */
  useEffect(() => {
    // void permet d'appeler une fonction async sans attendre sa valeur de retour
    // Cela évite certains avertissements TypeScript/ESLint
    void fetchGroup();
  }, [fetchGroup]);

  // Vérifie si l'utilisateur connecté est membre du groupe
  const isMember = group?.members.some((member) => member.id === user?.id);

  // Vérifie si l'utilisateur connecté est le propriétaire du groupe
  const isOwner = group?.owner.id === user?.id;

  /**
   * Fonction appelée lorsque l'utilisateur veut rejoindre le groupe
   */
  const handleJoin = async () => {
    try {
      // Réinitialisation des messages précédents
      setError("");
      setMessage("");

      // Appel API pour rejoindre le groupe
      await groupService.joinGroup(groupId);

      // Message de confirmation
      setMessage("Vous avez rejoint le groupe.");

      // Rechargement du groupe pour mettre à jour la liste des membres
      await fetchGroup();
    } catch (error) {
      // Affichage d'un message d'erreur compréhensible
      setError(
        getApiErrorMessage(error, "Erreur lors de l'inscription au groupe"),
      );
    }
  };

  /**
   * Fonction appelée lorsque l'utilisateur veut quitter le groupe
   */
  const handleLeave = async () => {
    try {
      // Réinitialisation des messages précédents
      setError("");
      setMessage("");

      // Appel API pour quitter le groupe
      await groupService.leaveGroup(groupId);

      // Message de confirmation
      setMessage("Vous avez quitté le groupe.");

      // Rechargement du groupe pour actualiser l'affichage
      await fetchGroup();
    } catch (error) {
      // Affichage d'un message d'erreur compréhensible
      setError(getApiErrorMessage(error, "Erreur lors de la sortie du groupe"));
    }
  };

  /**
   * Affichage pendant le chargement initial
   */
  if (loading) {
    return <p>Chargement du groupe...</p>;
  }

  /**
   * Affichage si aucun groupe n'a été trouvé
   */
  if (!group) {
    return <p>Groupe introuvable.</p>;
  }

  return (
    <div>
      {/* Lien de retour vers la liste des groupes */}
      <Link
        to="/groups"
        className="mb-6 inline-block text-sm font-medium text-blue-600"
      >
        ← Retour aux groupes
      </Link>

      {/* Message de succès */}
      {message && (
        <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Carte principale contenant les informations du groupe */}
      <section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            {/* Nom du groupe */}
            <h1 className="text-2xl font-bold sm:text-3xl">{group.name}</h1>

            {/* Description du groupe */}
            <p className="mt-2 text-slate-600">
              {group.description || "Aucune description."}
            </p>

            {/* Badges compétence et niveau */}
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {/* Compétence associée au groupe */}
              <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">
                {group.skill.name}
              </span>

              {/* Niveau du groupe affiché seulement s'il existe */}
              {group.level && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                  {levelLabel[group.level]}
                </span>
              )}
            </div>
          </div>

          {/* Zone d'action : rejoindre, quitter ou propriétaire */}
          <div className="grid gap-3 sm:flex">
            {/* Si l'utilisateur n'est pas membre, il peut rejoindre */}
            {!isMember && (
              <button
                onClick={handleJoin}
                className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
              >
                Rejoindre
              </button>
            )}

            {/* Si l'utilisateur est membre mais pas propriétaire, il peut quitter */}
            {isMember && !isOwner && (
              <button
                onClick={handleLeave}
                className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white transition-colors duration-200 hover:bg-red-700"
              >
                Quitter
              </button>
            )}

            {/* Si l'utilisateur est propriétaire, il ne peut pas quitter depuis ce bouton */}
            {isOwner && (
              <span className="rounded-lg bg-slate-100 px-5 py-3 text-sm font-medium text-slate-700">
                Propriétaire
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Zone secondaire : membres + actions */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Liste des membres du groupe */}
        <section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6 lg:col-span-2">
          <div className="mb-5 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Membres du groupe</h2>
          </div>

          <div className="space-y-3">
            {/* Parcours des membres du groupe */}
            {group.members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  {/* Nom complet du membre */}
                  <p className="font-medium">
                    {member.firstname} {member.lastname}
                  </p>

                  {/* Email du membre */}
                  <p className="text-sm text-slate-500">{member.email}</p>
                </div>

                {/* Rôle du membre */}
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Bloc contenant les actions disponibles pour ce groupe */}
        <aside className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-xl font-semibold">Actions</h2>

          <div className="mt-5 space-y-3">
            {/* Lien vers les sessions du groupe */}
            <Link
              to={`/groups/${group.id}/sessions`}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700"
            >
              <Calendar className="h-4 w-4" />
              Sessions du groupe
            </Link>

            {/* Lien vers la messagerie du groupe */}
            <Link
              to={`/groups/${group.id}/messages`}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700"
            >
              <MessageCircle className="h-4 w-4" />
              Messagerie
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
