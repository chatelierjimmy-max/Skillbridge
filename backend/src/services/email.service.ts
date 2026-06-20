import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const getSender = () =>
  process.env.RESEND_FROM_EMAIL ||
  process.env.EMAIL_FROM ||
  "SkillBridge <onboarding@resend.dev>";

export const emailService = {
  async sendWelcomeEmail(to: string, firstname: string) {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is missing");
      return;
    }

    await resend.emails.send({
      from: getSender(),
      to,
      subject: "Bienvenue sur SkillBridge",
      html: `
        <h1>Bienvenue ${firstname}</h1>
        <p>Ton compte SkillBridge a bien ete cree.</p>
        <p>Tu peux maintenant rejoindre des groupes, creer des sessions et progresser avec d'autres developpeurs.</p>
      `,
    });
  },

  async sendPasswordResetEmail(to: string, resetLink: string) {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is missing");
      return;
    }

    await resend.emails.send({
      from: getSender(),
      to,
      subject: "Reinitialisation de votre mot de passe SkillBridge",
      html: `
        <h1>Reinitialisation du mot de passe</h1>
        <p>Vous avez demande la modification de votre mot de passe SkillBridge.</p>
        <p><a href="${resetLink}">Modifier mon mot de passe</a></p>
        <p>Ce lien expire dans 1 heure.</p>
        <p>Si vous n'etes pas a l'origine de cette demande, ignorez cet email.</p>
      `,
    });
  },
};
