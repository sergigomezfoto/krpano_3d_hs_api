import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


async function main() {

  await prisma.tour.createMany({
    data: [
      { name: "Tour 1" },
      { name: "Tour 2" },
    ],
  });

  const tours = await prisma.tour.findMany();


  await prisma.scene.createMany({
    data: [
      { name: "scene_1_tour_1", tourId: tours[0].id },
      { name: "scene_2_tour_1", tourId: tours[0].id },
      { name: "scene_1_tour_2", tourId: tours[1].id },
    ],
  });


  const scenes = await prisma.scene.findMany();


  for (const scene of scenes) {
    const hotspotName = `${scene.name}_hotspot_1`;
    await prisma.hotspot.create({
      data: {
        name: hotspotName,
        sceneId: scene.id,
        data: {
          url: "../assets/360_1.jpg",
          position: [{ tx: 1, ty: 2, tz: 3 },{ rx: 1, ry: 2, rz: 3 }],
          style: `hs_image|${hotspotName}`,
          extras: "some extra data",
        },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
