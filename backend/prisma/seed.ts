import { prisma } from "../src/config/prisma";

type SkillSeed = {
  name: string;
  category: string;
  aliases?: string[];
};

const skills: SkillSeed[] = [
  { name: "HTML", category: "Front-end" },
  { name: "CSS", category: "Front-end" },
  { name: "JavaScript", category: "Front-end" },
  { name: "TypeScript", category: "Front-end" },
  { name: "React", category: "Front-end" },
  { name: "Next.js", category: "Front-end" },
  { name: "Vue.js", category: "Front-end" },
  { name: "Angular", category: "Front-end" },
  { name: "Node.js", category: "Back-end" },
  { name: "Express.js", category: "Back-end", aliases: ["Express"] },
  { name: "NestJS", category: "Back-end" },
  { name: "PHP", category: "Back-end" },
  { name: "Laravel", category: "Back-end" },
  { name: "Python", category: "Back-end" },
  { name: "Django", category: "Back-end" },
  { name: "FastAPI", category: "Back-end" },
  { name: "Java", category: "Back-end" },
  { name: "Spring Boot", category: "Back-end" },
  { name: "C#", category: "Back-end" },
  { name: "ASP.NET", category: "Back-end" },
  { name: "MySQL", category: "Database" },
  { name: "PostgreSQL", category: "Database" },
  { name: "MongoDB", category: "Database" },
  { name: "Redis", category: "Database" },
  { name: "Git", category: "Tools" },
  { name: "GitHub", category: "Tools" },
  { name: "Docker", category: "DevOps" },
  { name: "Kubernetes", category: "DevOps" },
  { name: "Linux", category: "DevOps" },
  { name: "AWS", category: "Cloud" },
  { name: "Azure", category: "Cloud" },
  { name: "Google Cloud", category: "Cloud" },
  { name: "REST API", category: "API" },
  { name: "GraphQL", category: "API" },
  { name: "JWT", category: "Security" },
  { name: "OAuth2", category: "Security" },
  { name: "Firebase", category: "Cloud" },
  { name: "Supabase", category: "Cloud" },
  { name: "OpenAI API", category: "AI" },
  { name: "TensorFlow", category: "AI" },
  { name: "PyTorch", category: "AI" },
  { name: "React Native", category: "Mobile" },
  { name: "Flutter", category: "Mobile" },
  { name: "WebRTC", category: "Real-time" },
  { name: "Socket.IO", category: "Real-time" },
  { name: "Figma", category: "Design" },
  { name: "WordPress", category: "CMS" },
  { name: "Stripe", category: "Payment" },
  { name: "CI/CD", category: "DevOps" },
  { name: "DevOps", category: "DevOps" },
];

async function upsertSkill(skill: SkillSeed) {
  const existingSkill = await prisma.skill.findUnique({
    where: { name: skill.name },
  });

  if (existingSkill) {
    await prisma.skill.update({
      where: { id: existingSkill.id },
      data: { category: skill.category },
    });
    return;
  }

  const aliasedSkill = skill.aliases?.length
    ? await prisma.skill.findFirst({
        where: {
          name: {
            in: skill.aliases,
          },
        },
      })
    : null;

  if (aliasedSkill) {
    await prisma.skill.update({
      where: { id: aliasedSkill.id },
      data: {
        name: skill.name,
        category: skill.category,
      },
    });
    return;
  }

  await prisma.skill.create({
    data: {
      name: skill.name,
      category: skill.category,
    },
  });
}

async function main() {
  for (const skill of skills) {
    await upsertSkill(skill);
  }

  console.log(`${skills.length} skills seeded`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
