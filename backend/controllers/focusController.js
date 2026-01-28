
const prisma = require('../prismaClient');

async function createFocus(req, res, ) {
    try { 
        const userId = req.session.userId; 
        const { name, areaId } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        const areaExists = await prisma.area.findFirst({
            where: { id: areaId, userId },
        });
        if (!areaExists) {
            return res.status(404).json({ message: 'Area not found' });
        }
        const newFocus = await prisma.focus.create({
            data: { name, user: { connect: { id: userId } }, area: { connect: { id: areaId } } },
        });
        res.status(201).json({ newFocus });
    } catch (error) {
        console.error('Create Focus Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
async function getFocus(req, res, ) {
    try { 
        const userId = req.session.userId; 
        const focus = await prisma.focus.findMany({
            where: { userId },
             orderBy: { createdAt: 'asc' },
        });
        res.status(200).json({ focus });
    }
    catch (error) {
        console.error('Get Focus Error:', error);
         res.status(500).json({ message: 'Internal server error' });
    }
}
async function deleteFocus(req, res, ) {
    try { 
        const userId = req.session.userId;
        const focusExists = await prisma.focus.findFirst({
            where: { id: Number(req.params.id), userId },
        });
        if (!focusExists) {
            return res.status(404).json({ message: 'Focus not found' });
        }
        const focus = await prisma.focus.delete({
            where: { id:focusExists.id },
        });
        res.status(200).json({ message: 'Focus deleted', focus });
    }
    catch (error) {
        console.error('Delete Focus Error:', error);
         res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports = { createFocus, getFocus, deleteFocus };


