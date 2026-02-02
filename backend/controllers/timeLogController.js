const prisma = require('../prismaClient');
async function createTimeLog(req, res) {
  try {
    const userId = req.session.userId;
    const {
      focusId,
      duration,
      areaId,
      description,
      energyBefore,
      energyAfter,
      attentionLevel,
    } = req.body;

    
    if (duration === undefined || areaId === undefined) {
      return res.status(400).json({ message: 'Duration and Area are required' });
    }

    if (typeof duration !== 'number' || duration <= 0) {
      return res.status(400).json({ message: 'Duration must be a positive number' });
    }

   
    if (description !== undefined && typeof description !== 'string') {
      return res.status(400).json({ message: 'Description must be a string' });
    }

    
    if (
      energyBefore !== undefined &&
      (typeof energyBefore !== 'number' || energyBefore < 1 || energyBefore > 5)
    ) {
      return res.status(400).json({ message: 'Energy before must be between 1 and 5' });
    }

    if (
      energyAfter !== undefined &&
      (typeof energyAfter !== 'number' || energyAfter < 1 || energyAfter > 5)
    ) {
      return res.status(400).json({ message: 'Energy after must be between 1 and 5' });
    }

    if (
      attentionLevel !== undefined &&
      (typeof attentionLevel !== 'number' || attentionLevel < 1 || attentionLevel > 5)
    ) {
      return res.status(400).json({ message: 'Attention level must be between 1 and 5' });
    }

    
    const areaExists = await prisma.area.findFirst({
      where: { id: areaId, userId },
    });

    if (!areaExists) {
      return res.status(404).json({ message: 'Area not found' });
    }

   
    if (focusId !== undefined) {
      const focusExists = await prisma.focus.findFirst({
        where: { id: focusId, userId, areaId },
      });

      if (!focusExists) {
        return res.status(404).json({ message: 'Focus not found' });
      }
    }

 
    const newTimeLog = await prisma.timeLog.create({
      data: {
        userId,
        areaId,
        focusId,
        duration,
        description,
        energyBefore,
        energyAfter,
        attentionLevel,
      },
    });

    res.status(201).json({ newTimeLog });
  } catch (error) {
    console.error('Create TimeLog Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
async function getTimeLogs(req, res) {
    try { 
        const userId = req.session.userId;
      
        const timeLogs = await prisma.timeLog.findMany({
            where: { userId },
            distinct : ['areaId'],
            
            include: { area:{select: { name: true } } , focus: true },
        
             orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ timeLogs });
    }
    catch (error) {
        console.error('Get TimeLogs Error:', error);
         res.status(500).json({ message: 'Internal server error' });
    }
}
async function getTodayTimeLogs(req, res) {
    try { 
        const userId = req.session.userId;
        const now = new Date();
       const startoftheDay = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          0,
          0,
          0,
          0
        )
      );
      const endoftheDay = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate()+ 1,
          0,
          0,
          0,
          0
        )
      );
        const timeLogs = await prisma.timeLog.findMany({
            where: { 
                userId,
                createdAt: {
                    gte: startoftheDay,
                    lt: endoftheDay,
                  },
             },
            include: { area:{select: { name: true } } , focus: true },
              orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ timeLogs });
    }
    catch (error) {
        console.error('Get Today TimeLogs Error:', error);
         res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = { createTimeLog, getTimeLogs, getTodayTimeLogs };