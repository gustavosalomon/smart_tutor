import express from "express";
import User from "../models/User.js";
const Progress = require('../models/Progress.js');

const router = express.Router();

// GET /api/progress/:userId/:subjectId
// Obtener progreso del usuario para una materia
router.get('/:userId/:subjectId', async (req, res) => {
  try {
    const progress = await Progress.findOne({
      userId: req.params.userId,
      subjectId: req.params.subjectId
    });
    res.json(progress || { currentUnit: 1, completedUnits: [], completedLessons: [], exercises: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/progress/complete-unit
// Actualizar progreso al completar una unidad
router.post('/complete-unit', async (req, res) => {
  try {
    const { userId, subjectId, subjectName, unitId } = req.body;
    
    let progress = await Progress.findOne({ userId, subjectId });
    
    if (!progress) {
      progress = new Progress({ userId, subjectId, subjectName });
    }
    
    // Agregar unidad completada si no existe
    const unitExists = progress.completedUnits.find(u => u.unitId === unitId);
    if (!unitExists) {
      progress.completedUnits.push({ unitId, completedAt: new Date() });
    }
    
    // Actualizar unidad actual
    progress.currentUnit = unitId + 1;
    progress.lastAccessed = new Date();
    
    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/progress/save-exercise
// Guardar respuesta de ejercicio
router.post('/save-exercise', async (req, res) => {
  try {
    const { userId, subjectId, subjectName, unitId, question, answer, isCorrect } = req.body;
    
    let progress = await Progress.findOne({ userId, subjectId });
    
    if (!progress) {
      progress = new Progress({ userId, subjectId, subjectName });
    }
    
    progress.exercises.push({
      unitId,
      question,
      answer,
      isCorrect,
      attemptedAt: new Date()
    });
    
    progress.lastAccessed = new Date();
    await progress.save();
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/progress/complete-lesson
// Marcar lección como completada
router.post('/complete-lesson', async (req, res) => {
  try {
    const { userId, subjectId, subjectName, unitId, lessonIndex } = req.body;
    
    let progress = await Progress.findOne({ userId, subjectId });
    
    if (!progress) {
      progress = new Progress({ userId, subjectId, subjectName });
    }
    
    const lessonExists = progress.completedLessons.find(
      l => l.unitId === unitId && l.lessonIndex === lessonIndex
    );
    
    if (!lessonExists) {
      progress.completedLessons.push({
        unitId,
        lessonIndex,
        completedAt: new Date()
      });
    }
    
    progress.lastAccessed = new Date();
    await progress.save();
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/progress/save-quiz-score
// Guardar puntaje de quiz
router.post('/save-quiz-score', async (req, res) => {
  try {
    const { userId, subjectId, unitId, score, totalQuestions } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    let subjectProgress = user.subjects.find(s => s.subjectId.toString() === subjectId);
    
    if (!subjectProgress) {
      // Si no existe progreso para esta materia, crear uno nuevo
      user.subjects.push({
        subjectId,
        completedLessons: 0,
        totalLessons: 5,
        score: 0,
        lastAccess: new Date()
      });
      subjectProgress = user.subjects[user.subjects.length - 1];
    }

    // Actualizar el score (puedes ajustar la lógica según tu necesidad)
    // Por ejemplo, calcular un promedio o sumar puntos
    const percentageScore = (score / totalQuestions) * 100;
    subjectProgress.score = Math.max(subjectProgress.score, percentageScore);
    subjectProgress.lastAccess = new Date();

    await user.save();

    res.json({ 
      message: "Puntaje de quiz guardado correctamente", 
      score: subjectProgress.score,
      quizScore: score,
      totalQuestions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al guardar puntaje del quiz" });
  }
});

// POST /api/progress/update
// Actualizar el progreso de una materia (mantener compatibilidad)
router.post("/update", async (req, res) => {
  try {
    const { userId, subjectId, completedLessons, score } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const subjectProgress = user.subjects.find(s => s.subjectId.toString() === subjectId);
    if (!subjectProgress) return res.status(404).json({ message: "Materia no encontrada en el usuario" });

    // Actualizar progreso
    subjectProgress.completedLessons = completedLessons;
    subjectProgress.score = score;
    subjectProgress.lastAccess = new Date();

    await user.save();

    res.json({ message: "Progreso actualizado correctamente", subjects: user.subjects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar progreso" });
  }
});

export default router;
