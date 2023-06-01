import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()



const main = async () => {

  const createdTours = await prisma.tour.createMany({
    data: [
      { name: "tour_1" },
      { name: "tour_2" },
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
      const hotspotName = `hs_${i + 1}_${scene.name}`;
      const tx = (Math.random() * 4000) - 2000;
      const ty = (Math.random() * 4000) - 2000;
      const tz = (Math.random() * 4000) - 2000;
      const rx = Math.random() * 360;
      const ry = Math.random() * 360;
      const rz = Math.random() * 360;
      const scale = Math.random() * 0.9 + 0.1;
      const createdHotspot = await prisma.hotspot.create({
        data: {
          name: hotspotName,
          sceneId: scene.id,
          transform: { tx, ty, tz, rx, ry, rz, scale },
          style: `hs_image|${hotspotName}`,
          extraData: {
            url: "../assets/360_1.jpg",
            blendmode: "add", 
            alpha: "1",
          },
        },
        select: { // select: retorna només els camps que especifiquem
          id: true,
          name: true,
          transform: true,
          style: true,
          extraData: true,  
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