const e = require('express');
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
            include: { area:{select: { name: true },  } , focus: true },
              orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ timeLogs });
    }
    catch (error) {
        console.error('Get Today TimeLogs Error:', error);
         res.status(500).json({ message: 'Internal server error' });
    }
}
async function getweekTimeLogs(req, res) {
    try {
        const userId = req.session.userId;
        const now = new Date();
        const  day = now.getUTCDay();
        const diffToSunday = day;
        const startOfWeek = new Date(
            Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate() - diffToSunday,
                0,
                0,
                0,
                0
            )
        );
        const endOfWeek = new Date(
            Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate() - diffToSunday + 7,
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
                    gte: startOfWeek,
                    lt: endOfWeek,
                  },
            },
            include: { area:{select: { name: true },  } , focus: true },
              orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ timeLogs });
    }
    catch (error) {
        console.error('Get Week TimeLogs Error:', error);
         res.status(500).json({ message: 'Internal server error' });
    }
}
async function getMonthTimeLogs(req, res) {
    try {
        const userId = req.session.userId;
        const now = new Date();
        const startOfMonth = new Date(
            Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                1,
                0,
                0,
                0,
                0
            )
        );
        const endOfMonth = new Date(
            Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth() + 1,
                1,
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
                    gte: startOfMonth,
                    lt: endOfMonth,
                  },
            },
            include: { area:{select: { name: true },  } , focus: true },
              orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ timeLogs });
    }
    catch (error) {
        console.error('Get Month TimeLogs Error:', error);
         res.status(500).json({ message: 'Internal server error' });
    }
}
async function getYearTimeLogs(req, res) {
    try {
        const userId = req.session.userId;
        const now = new Date();
        const startOfYear = new Date(
            Date.UTC(
                now.getUTCFullYear(),
                0,
                1,
                0,
                0,
                0,
                0
            )
        );
        const endOfYear = new Date(
            Date.UTC(
                now.getUTCFullYear() + 1,
                0,
                1,
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
                    gte: startOfYear,
                    lt: endOfYear,
                  },
            },
            include: { area:{select: { name: true },  } , focus: true },
              orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ timeLogs });
    }
    catch (error) {
        console.error('Get Year TimeLogs Error:', error);
         res.status(500).json({ message: 'Internal server error' });
    }
}
async function updateTimeLog(req, res) {
    try {
        const userId = req.session.userId;
        const timeLogId = parseInt(req.params.id);
        const {
            duration,
            description,
            energyBefore,
            energyAfter,
            attentionLevel,
        } = req.body;
      if(!duration){
        return res.status(400).json({ message: 'All fields are required' });
      }
        const log = await prisma.timeLog.findFirst({
  where: { id: timeLogId, userId },
});
      if (!log) {
  return res.status(404).json({ message: 'TimeLog not found' });
}
      const updatedTimeLog = await prisma.timeLog.update({
        where: { id: timeLogId},
        data: {
          duration,
          description,
          energyBefore,
          energyAfter,
          attentionLevel,
        },
      });
      res.status(200).json({ updatedTimeLog });
    }
    catch (error) {
        console.error('Update TimeLog Error:', error);
         res.status(500).json({ message: 'Internal server error' });
    }
}
async function deleteTimeLog(req, res) {
    try {
        const userId = req.session.userId;
        const timeLogId = parseInt(req.params.id);
        await prisma.timeLog.deleteMany({
            where: { id: timeLogId, userId },
        });
        res.status(200).json({ message: 'Time log deleted' });
    }
    catch (error) {
        console.error('Delete TimeLog Error:', error);
         res.status(500).json({ message: 'Internal server error' });
    }
}
      
      
module.exports = { createTimeLog, getTimeLogs, getTodayTimeLogs, getweekTimeLogs, getMonthTimeLogs, getYearTimeLogs, updateTimeLog, deleteTimeLog };
