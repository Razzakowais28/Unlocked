import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";
import { addYears } from "date-fns";
import { nanoid } from "nanoid";

const dbPath = path.join(__dirname, "..", "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "owaisrak28@gmail.com" },
    update: { name: "owais" },
    create: {
      name: "owais",
      email: "owaisrak28@gmail.com",
    },
  });

  const capsules = [
    {
      title: "Birthday Message",
      description: "A surprise letter for your next birthday",
      capsuleType: "birthday",
      theme: "wedding-glow",
      unlockDate: addYears(new Date(), 1),
      isLocked: true,
      shareSlug: nanoid(10),
      blocks: [
        {
          type: "text",
          title: "Happy Birthday!",
          content:
            "Dear future you,\n\nI wrote this on a day when everything felt possible. I hope when you read this, you've achieved everything you dreamed of. Remember to celebrate — you deserve it.\n\nWith love,\nPast You",
          sortOrder: 0,
        },
        {
          type: "photo",
          title: "Birthday memories",
          content: null,
          mediaUrl: null,
          sortOrder: 1,
        },
        {
          type: "audio",
          title: "Voice note",
          content: "A voice message for your special day",
          mediaUrl: null,
          sortOrder: 2,
        },
      ],
    },
    {
      title: "Wedding Anniversary",
      description: "Our love story, preserved for the future",
      capsuleType: "couple",
      theme: "sunset-memory",
      unlockDate: addYears(new Date(), 5),
      isLocked: true,
      shareSlug: nanoid(10),
      blocks: [
        {
          type: "memory",
          title: "The day we met",
          content:
            "It was a rainy Tuesday. You were reading a book in the coffee shop corner. I knew right then.",
          sortOrder: 0,
        },
        {
          type: "photo",
          title: "Our first photo together",
          content: null,
          mediaUrl: null,
          sortOrder: 1,
        },
      ],
    },
    {
      title: "My 2030 Goals",
      description: "Dreams I'm working toward",
      capsuleType: "personal",
      theme: "cosmic-night",
      unlockDate: addYears(new Date(), 5),
      isLocked: false,
      shareSlug: nanoid(10),
      blocks: [
        {
          type: "goal",
          title: "2030 Goals",
          content:
            "Learn to play guitar\nTravel to Japan\nRun a marathon\nWrite a book\nBuild something meaningful",
          sortOrder: 0,
        },
        {
          type: "text",
          title: "Letter to future me",
          content:
            "Hey future me — I hope you've checked off at least half of these. No pressure though. Just keep going.",
          sortOrder: 1,
        },
      ],
    },
  ];

  for (const capsuleData of capsules) {
    const { blocks, ...data } = capsuleData;
    const existing = await prisma.capsule.findFirst({
      where: { userId: user.id, title: data.title },
    });

    if (!existing) {
      await prisma.capsule.create({
        data: {
          ...data,
          userId: user.id,
          blocks: { create: blocks },
        },
      });
    }
  }

  console.log("Seed completed!");
  console.log("Demo user: owais / owaisrak28@gmail.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
