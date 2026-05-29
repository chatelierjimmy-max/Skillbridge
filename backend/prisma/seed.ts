import { prisma } from "../src/config/prisma";

const skills = [
  { name: "HTML", category: "Front-end" },
  { name: "CSS", category: "Front-end" },
  { name: "JavaScript", category: "Front-end" },
  { name: "TypeScript", category: "Front-end" },
  { name: "React", category: "Front-end" },
  { name: "Node.js", category: "Back-end" },
  { name: "Express", category: "Back-end" },
  { name: "MySQL", category: "Database" },
  { name: "MongoDB", category: "Database" },
  { name: "Docker", category: "DevOps" },
];

async function main() {
  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill,
    });
  }

  console.log("Skills seeded");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
