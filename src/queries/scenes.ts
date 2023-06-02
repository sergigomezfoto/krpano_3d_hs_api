import { Router } from "express";
import { prisma } from "../prisma-client.js";
import { queryErrorHandler } from "../helpers/errorHandlers.js";

const apiRouter = Router();


//GET totes les scenes a la base de dades
apiRouter.get('/', queryErrorHandler(async (req, res) => {
    const result = await prisma.scene.findMany({
        select: {
            id: true,
            tourId: true,
            name: true,
            hotspots: {
                select: { id: true, name: true }
            },
        },
    });

    res.status(200).json({ ok: true, result });
}));

//GET totes les escenes de las bbdd amb el mateix nom
apiRouter.get('/name/:name', queryErrorHandler(async (req, res) => {
    const { name } = req.params;
    const result = await prisma.scene.findMany({
        where: { name: name },
        select: {
            id: true,
            tourId: true,
            name: true,
            hotspots: {
                select: { id: true, name: true }
            },
            tour: {
                select: { id: true, name: true }
            },
        }
    });
    result.length === 0
        ? res.status(404).json({ ok: false, message: `There are no scenes with the name: ${name}.` })
        : res.status(200).json({ ok: true, result });
}));


//GET escena per id
apiRouter.get('/:id', queryErrorHandler(async (req, res) => {
    const { id } = req.params;
    const result = await prisma.scene.findUnique({
        where: { id: Number(id) },
        select: {
            id: true,
            tourId: true,
            name: true,
            hotspots: {
                select: { id: true, name: true }
            },
            tour: {
                select: { id: true, name: true }
            },
        }
    });

    result !== null
        ? res.status(200).json({ ok: true, result })
        : (() => { throw new Error(`[custom error] Tour with id ${id} not found`); })();

}));


//GET totes les scenes d'un tour per tour id
apiRouter.get('/tourid/:tourid', queryErrorHandler(async (req, res) => {
    const { tourid } = req.params;
    const result = await prisma.scene.findMany({
        where: { tourId: Number(tourid) },
        select: {
            id: true,
            tourId: true,
            name: true,
            hotspots: {
                select: { id: true, name: true }
            },
        },
    });

    result.length === 0
        ? res.status(404).json({ ok: false, message: `Scene belonging to tour id: ${tourid} not found` })
        : res.status(200).json({ ok: true, result });
}));

//GET totes les scenes d'un tour per tour name
apiRouter.get('/tourname/:tourname', queryErrorHandler(async (req, res) => {
    const { tourname } = req.params;
    const result = await prisma.scene.findMany({
        where: {
            tour:
                { name: tourname }
        },
        select: {
            id: true,
            tourId: true,
            name: true,
            hotspots: {
                select: { id: true, name: true }
            },
        },
    });
    result.length === 0
        ? res.status(404).json({ ok: false, message: `Scene belonging to tour ${tourname} not found` })
        : res.status(200).json({ ok: true, result });
}));


// PUT scene per ID
apiRouter.put('/:id', queryErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { name, tourId } = req.body;

    const existingScene = await prisma.scene.findUnique({
        where: { id: Number(id) },
        select: { tourId: true },
    });
    const updatedTourId = tourId || existingScene.tourId;

    const uptdatedScene = await prisma.scene.update({
        where: { id: Number(id) },
        data: {
            name,
            tourId: Number(updatedTourId),
        },
        select: {
            id: true,
            name: true,
            tourId: true,
            hotspots: {
                select: { id: true, name: true }
            },
        },
    });

    res.status(200).json({ ok: true, uptdatedScene });
}));

//POST una scene
apiRouter.post('/', queryErrorHandler(async (req, res) => {
    const { tourId, ...restData } = req.body;
    const newScene = await prisma.scene.create({
        data: {
            ...restData,
            tourId: Number(tourId),
        },
    });
    res.status(200).json({ ok: true, newScene });
}));

//DELETE per ID 
apiRouter.delete('/:id', queryErrorHandler(async (req, res) => {
    const { id } = req.params;
    const scene = await prisma.scene.findUnique({
        where: { id: Number(id) },
        select: {
            name: true,
            hotspots: {
                select: {
                    name: true,
                },
            },
        },
    });
    const deletedScene = await prisma.scene.delete({
        where: { id: Number(id) },
    });

    // Recuperar els noms de les escenes eliminades i els seus hotspots relacionats
    const deletedHotspots = scene.hotspots.map(hotspot => hotspot.name);

    //en delete prisma decideix llençar error si no troba res, per això no cal fer la comprovació
    res.status(200).json({ ok: true, deletedScene, deletedHotspots });

}));


export default apiRouter;