import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {

  const createdTours = await prisma.tour.createMany({
    data: [
      { name: "Tour 1" },
      { name: "Tour 2" },
    ]
  });
  console.log("Tours created: ", createdTours);

  const tours = await prisma.tour.findMany();
  console.log("records: ", tours);

  const createdScenes = await prisma.scene.createMany({
    data: [
      { name: "scene_1_tour_1", tourId: tours[0].id },
      { name: "scene_2_tour_1", tourId: tours[0].id },
      { name: "scene_1_tour_2", tourId: tours[1].id },
    ]
  });
  console.log("Scenes created: ", createdScenes);

  const scenes = await prisma.scene.findMany();
  console.log("records: ", scenes);


  for (const scene of scenes) {   
    const numHotspots = Math.floor(Math.random() * 3) + 1; // 1-3(aleatori) hotspots 

    for (let i = 0; i < numHotspots; i++) {
      const hotspotName = `${scene.name}_hotspot_${i + 1}`;
      const createdHotspot = await prisma.hotspot.create({
        data: {
          name: hotspotName,
          sceneId: scene.id,
          data: {
            url: "../assets/360_1.jpg",
            position: [{ tx: 1, ty: 2, tz: 3 }, { rx: 1, ry: 2, rz: 3 }, { scale: 1 }],
            style: `hs_image|${hotspotName}`,
            extras: { blendmode: "add", alpha: "1" },
          },
        },
        select: { // select: retorna només els camps que especifiquem
          id: true,
          name: true,
        },
      });
      console.log("Hotspot created: ", createdHotspot);
    }
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