import { Router } from "express";
import { prisma } from "./prisma-client.js";
import { queryErrorHandler, errorHandler } from "./errorHandler.js";
const apiRouter = Router();
apiRouter.use(errorHandler);

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
                },
            },
        },
    });
    const count = await prisma.tour.count();
    res.status(200).json({ count, result });
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
                }
            }
        }
    });
    if (result === null) return res.status(404).json({ message: `Tour with id ${id} not found` });
    res.status(200).json({ result });

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
                }
            }
        }
    });
    if (result === null) return res.status(404).json({ message: `Tour with called ${name} not found` });
    res.status(200).json({ result });

}));


export default apiRouter;