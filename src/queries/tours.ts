import { Router } from "express";
import { prisma } from "../prisma-client.js";
import { queryErrorHandler } from "../helpers/errorHandlers.js";

const apiRouter = Router();


//GET tots els tours
apiRouter.get('/', queryErrorHandler(async (req, res) => {
    const result = await prisma.tour.findMany({
        select: {
            id: true,
            name: true,
            scenes: {
                select: {
                    id: true,
                    name: true,
                    hotspots: {
                        select: { id: true, name: true }
                    }
                },
            },
        },
    });

    res.status(200).json({ ok: true, result });
}));


//GET per id
apiRouter.get('/:id', queryErrorHandler(async (req, res) => {
    const { id } = req.params;
    const result = await prisma.tour.findUnique({
        where: { id: Number(id) },
        select: {
            id: true,
            name: true,
            scenes: {
                select: {
                    id: true,
                    name: true,
                    hotspots: {
                        select: { id: true, name: true }
                    }
                }
            }
        }
    });
    //en findUnique prisma decideix no llençar error si no troba res, per això cal fer la comprovació
    result !== null
        ? res.status(200).json({ ok: true, result })
        : (() => { throw new Error(`Tour with id ${id} not found`); })();

}));

// GET per nom
apiRouter.get('/name/:name', queryErrorHandler(async (req, res) => {
    const { name } = req.params;
    const result = await prisma.tour.findUnique({
        where: { name },
        select: {
            id: true, name: true, scenes: {
                select: {
                    id: true,
                    name: true,
                    hotspots: {
                        select: { id: true, name: true }
                    }
                }
            }
        }
    });
    //al findUnique prisma decideix no llençar error si no troba res, per això cal fer la comprovació
    result !== null
        ? res.status(200).json({ ok: true, result })
        : (() => { throw new Error(`Tour with id ${name} not found`); })();


}));

// PUT per ID
apiRouter.put('/:id', queryErrorHandler(async (req, res) => {
    const { id } = req.params;
    const uptdatedTour = await prisma.tour.update({
        where: { id: Number(id) },
        data: req.body,
    });
    //en update prisma decideix llençar error si no troba res, per això no cal fer la comprovació
    res.status(200).json({ ok: true, uptdatedTour });
}));

//POST un tour
apiRouter.post('/', queryErrorHandler(async (req, res) => {
    const newTour = await prisma.tour.create({ data: req.body });
    res.status(200).json({ ok: true, newTour });
}));

//DELETE per ID 
apiRouter.delete('/:id', queryErrorHandler(async (req, res) => {
    const { id } = req.params;
    const tour = await prisma.tour.findUnique({
        where: { id: Number(id) },
        select: {
            name: true,
            scenes: {
                select: {
                    name: true,
                    hotspots: { select: { name: true } },
                },
            },
        },
    });
    const deletedTour = await prisma.tour.delete({
        where: { id: Number(id) },
    });

    // Recuperar els noms de les escenes eliminades i els seus hotspots relacionats
    const deletedScenesAndHotspots = tour.scenes.map(scene => ({
        name: scene.name,
        deletedHotspots: scene.hotspots.map(hotspot => hotspot.name),
    }));

    //en delete prisma decideix llençar error si no troba res, per això no cal fer la comprovació
    res.status(200).json({ ok: true, deletedTour, deletedScenesAndHotspots });

}));

export default apiRouter;