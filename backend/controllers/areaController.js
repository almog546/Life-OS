const prisma = require('../prismaClient');
async function createArea(req, res, ) {
    try { 
        const userId = req.session.userId; 
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
  
        const newArea = await prisma.area.create({
            data: { name, userId },
        });
        
        res.status(201).json({ area: newArea });
    }
    catch (error) {
        console.error('Create Area Error:', error);
         res.status(500).json({ message: 'Internal server error' });
    }
}
async function getAreas(req, res, ) {
    try { 
        const userId = req.session.userId; 
        let areas = await prisma.area.findMany({
            where: { userId },
             orderBy: { createdAt: 'asc' },
        });
        if (areas.length === 0) {
            const defaultAreasData = [
                { name: 'Career', userId },
                { name: 'Learning', userId },
                { name: 'Health', userId },
                { name: 'Finance', userId },
                { name: 'Personal', userId },
            ];
            await prisma.area.createMany({
                data: defaultAreasData,
            }); 
            areas = await prisma.area.findMany({
                where: { userId },
                orderBy: { createdAt: 'asc' },
            });
           return res.status(200).json({ areas });
        }
        res.status(200).json({ areas });
        
       
    }
    catch (error) {
        console.error('Get Areas Error:', error);
         res.status(500).json({ message: 'Internal server error' });
    }
}
async function editArea(req, res, ) {
    try { 
        const userId = req.session.userId;
        const areaId = parseInt(req.params.id);
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        const area = await prisma.area.update({
            where: { id: areaId, userId },
            data: { name },
        });
        res.status(200).json({ area });
    }
    catch (error) {
        console.error('Edit Area Error:', error);
         res.status(500).json({ message: 'Internal server error' });
    }
}
async function deleteArea(req, res, ) {
    try { 
        const userId = req.session.userId;
        const areaId = parseInt(req.params.id);
        await prisma.area.deleteMany({
            where: { id: areaId, userId },
        });
        res.status(200).json({ message: 'Area deleted' });
    }
    catch (error) {
        console.error('Delete Area Error:', error);
         res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports = {
    createArea,
    getAreas,
    editArea,
    deleteArea,
};
