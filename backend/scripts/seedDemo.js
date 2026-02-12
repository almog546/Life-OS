const { PrismaClient } = require("@prisma/client");
const dayjs = require("dayjs");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();


async function seedDemo() {
    
  

  
  let demoUser = await prisma.user.findUnique({
    where: { email: "demo@lifeos.com" },
  });

  if (!demoUser) {
    console.log("Creating demo user...");

    const hashedPassword = await bcrypt.hash("12345678", 10);

    demoUser = await prisma.user.create({
      data: {
        email: "demo@lifeos.com",
        password: hashedPassword,
        name: "Demo User",
      },
    });
  }

  console.log("Demo user ID:", demoUser.id);

 
 

  await prisma.$transaction([
    prisma.timeLog.deleteMany({
      where: { userId: demoUser.id },
    }),
    prisma.focus.deleteMany({
      where: { userId: demoUser.id },
    }),
    prisma.area.deleteMany({
      where: { userId: demoUser.id },
    }),
  ]);


  

  const areaNames = ["Coding", "Fitness", "Reading", "Trading", "Business"];
  const areas = [];

  for (const name of areaNames) {
    const area = await prisma.area.create({
      data: {
        name,
        userId: demoUser.id,
      },
    });
    areas.push(area);
  }

 

  const focusMap = {
    Coding: ["React", "Backend", "Algorithms"],
    Fitness: ["Gym", "Running"],
    Reading: ["Books", "Articles"],
    Trading: ["Backtesting", "Market Study"],
    Business: ["Planning", "Marketing"],
  };

  const focusItems = [];

  for (const area of areas) {
    const focusNames = focusMap[area.name];

    for (const fname of focusNames) {
      const focus = await prisma.focus.create({
        data: {
          name: fname,
          areaId: area.id,
          userId: demoUser.id,
        },
      });
      focusItems.push(focus);
    }
  }

  
  
  

  const startDate = dayjs().subtract(3, "month");
  const today = dayjs();
  let currentDate = startDate;

  while (currentDate.isBefore(today)) {
    const dayOfWeek = currentDate.day();

    if (dayOfWeek !== 5 && dayOfWeek !== 6) {
      const logsPerDay = Math.floor(Math.random() * 2) + 1;

      for (let i = 0; i < logsPerDay; i++) {
        const randomFocus =
          focusItems[Math.floor(Math.random() * focusItems.length)];

        await prisma.timeLog.create({
          data: {
            userId: demoUser.id,
            areaId: randomFocus.areaId,
            focusId: randomFocus.id,
            duration: Math.floor(Math.random() * 90) + 30,
            energyBefore: Math.floor(Math.random() * 5) + 1,
            energyAfter: Math.floor(Math.random() * 5) + 1,
            attentionLevel: Math.floor(Math.random() * 5) + 1,
            description: "Demo session",
            createdAt: currentDate
              .hour(Math.floor(Math.random() * 8) + 8)
              .toDate(),
          },
        });
      }
    }

    currentDate = currentDate.add(1, "day");
  }


}

seedDemo()
  .catch((e) => {
    console.error("❌ SEED ERROR:");
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
