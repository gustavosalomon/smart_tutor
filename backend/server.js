const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((err) => console.error('❌ Error:', err));

const userSchema = new mongoose.Schema({
  dni: { type: String, required: true },
  name: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'tutor', 'admin'], default: 'student' },
  subjects: [{
    subjectId: { type: String, required: true },
    subjectName: { type: String, required: true },
    currentUnit: { type: Number, default: 1 },
    completedUnits: [{
      unitId: Number,
      completedAt: Date
    }],
    completedLessons: [{
      unitId: Number,
      lessonIndex: Number,
      completedAt: Date
    }],
    exercises: [{
      unitId: Number,
      question: String,
      answer: String,
      isCorrect: Boolean,
      attemptedAt: Date
    }],
    quizScores: [{
      unitId: Number,
      score: Number,
      totalQuestions: Number,
      percentage: Number,
      attemptedAt: {
        type: Date,
        default: Date.now
      }
    }],
    lastAccessed: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Middleware para verificar JWT
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token requerido' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
}
// Obtener datos del usuario autenticado
app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { dni, email, password, name, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'El email ya está registrado' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ dni, name, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error en el registro' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ message: 'Login exitoso', token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el login' });
  }
});

// Obtener progreso del usuario para una materia específica
app.get('/api/progress/:userId/:subjectId', authMiddleware, async (req, res) => {
  try {
    const { userId, subjectId } = req.params;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Buscar el progreso de esta materia en el array subjects del usuario
    const subjectProgress = user.subjects.find(s => s.subjectId === subjectId);
    
    if (!subjectProgress) {
      // Si no existe progreso, devolver valores por defecto
      return res.json({
        currentUnit: 1,
        completedUnits: [],
        completedLessons: [],
        exercises: [],
        quizScores: []
      });
    }
    
    res.json(subjectProgress);
  } catch (error) {
    console.error('Error al obtener progreso:', error);
    res.status(500).json({ message: 'Error al obtener progreso' });
  }
});

// Guardar respuesta de ejercicio
app.post('/api/progress/save-exercise', authMiddleware, async (req, res) => {
  try {
    const { userId, subjectId, subjectName, unitId, question, answer, isCorrect } = req.body;
    
    // Validar datos
    if (!userId || !subjectId || unitId === undefined || !question || !answer) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }
    
    // Buscar el usuario
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Buscar si ya existe progreso para esta materia
    let subjectProgress = user.subjects.find(s => s.subjectId === subjectId);
    
    if (!subjectProgress) {
      // Si no existe, crear nuevo progreso para esta materia
      subjectProgress = {
        subjectId,
        subjectName: subjectName || 'Materia',
        currentUnit: 1,
        completedUnits: [],
        completedLessons: [],
        exercises: [],
        quizScores: [],
        lastAccessed: new Date()
      };
      user.subjects.push(subjectProgress);
    }
    
    // Agregar el ejercicio
    subjectProgress.exercises.push({
      unitId,
      question,
      answer,
      isCorrect: isCorrect || false,
      attemptedAt: new Date()
    });
    
    // Actualizar última fecha de acceso
    subjectProgress.lastAccessed = new Date();
    
    // Guardar el usuario actualizado
    await user.save();
    
    res.json({
      message: 'Ejercicio guardado exitosamente',
      progress: subjectProgress
    });
  } catch (error) {
    console.error('Error al guardar ejercicio:', error);
    res.status(500).json({ message: 'Error al guardar ejercicio' });
  }
});

// Completar unidad
app.post('/api/progress/complete-unit', authMiddleware, async (req, res) => {
  try {
    const { userId, subjectId, subjectName, unitId } = req.body;
    
    // Validar datos
    if (!userId || !subjectId || unitId === undefined) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }
    
    // Buscar el usuario
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Buscar si ya existe progreso para esta materia
    let subjectProgress = user.subjects.find(s => s.subjectId === subjectId);
    
    if (!subjectProgress) {
      // Si no existe, crear nuevo progreso para esta materia
      subjectProgress = {
        subjectId,
        subjectName: subjectName || 'Materia',
        currentUnit: 1,
        completedUnits: [],
        completedLessons: [],
        exercises: [],
        quizScores: [],
        lastAccessed: new Date()
      };
      user.subjects.push(subjectProgress);
    }
    
    // Verificar si la unidad ya está completada
    const unitAlreadyCompleted = subjectProgress.completedUnits.some(u => u.unitId === unitId);
    
    if (!unitAlreadyCompleted) {
      subjectProgress.completedUnits.push({
        unitId,
        completedAt: new Date()
      });
    }
    
    // Avanzar a la siguiente unidad
    subjectProgress.currentUnit = unitId + 1;
    
    // Actualizar última fecha de acceso
    subjectProgress.lastAccessed = new Date();
    
    // Guardar el usuario actualizado
    await user.save();
    
    res.json({
      message: 'Unidad completada exitosamente',
      currentUnit: subjectProgress.currentUnit,
      completedUnits: subjectProgress.completedUnits,
      progress: subjectProgress
    });
  } catch (error) {
    console.error('Error al completar unidad:', error);
    res.status(500).json({ message: 'Error al completar unidad' });
  }
});

// Guardar puntaje de quiz
app.post('/api/progress/save-quiz-score', authMiddleware, async (req, res) => {
  try {
    const { userId, subjectId, subjectName, unitId, score, totalQuestions } = req.body;
    
    // Validar datos
    if (!userId || !subjectId || unitId === undefined || score === undefined || !totalQuestions) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }
    
    // Buscar el usuario
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Buscar si ya existe progreso para esta materia
    let subjectProgress = user.subjects.find(s => s.subjectId === subjectId);
    
    if (!subjectProgress) {
      // Si no existe, crear nuevo progreso para esta materia
      subjectProgress = {
        subjectId,
        subjectName: subjectName || 'Materia',
        currentUnit: 1,
        completedUnits: [],
        completedLessons: [],
        exercises: [],
        quizScores: [],
        lastAccessed: new Date()
      };
      user.subjects.push(subjectProgress);
    }
    
    // Calcular porcentaje
    const percentage = Math.round((score / totalQuestions) * 100);
    
    // Agregar el nuevo puntaje
    subjectProgress.quizScores.push({
      unitId,
      score,
      totalQuestions,
      percentage,
      attemptedAt: new Date()
    });
    
    // Si el quiz se completó con 100%, marcar la unidad como completada y avanzar
    if (percentage === 100) {
      // Verificar si la unidad ya está en completedUnits
      const unitAlreadyCompleted = subjectProgress.completedUnits.some(u => u.unitId === unitId);
      
      if (!unitAlreadyCompleted) {
        subjectProgress.completedUnits.push({
          unitId,
          completedAt: new Date()
        });
      }
      
      // Avanzar a la siguiente unidad si esta era la actual
      if (subjectProgress.currentUnit === unitId) {
        subjectProgress.currentUnit = unitId + 1;
      }
    }
    
    // Actualizar última fecha de acceso
    subjectProgress.lastAccessed = new Date();
    
    // Guardar el usuario actualizado
    await user.save();
    
    res.json({
      message: 'Puntaje guardado exitosamente',
      quizScore: {
        score,
        totalQuestions,
        percentage
      },
      unitCompleted: percentage === 100,
      nextUnit: percentage === 100 ? unitId + 1 : subjectProgress.currentUnit,
      progress: subjectProgress
    });
  } catch (error) {
    console.error('Error al guardar puntaje del quiz:', error);
    res.status(500).json({ message: 'Error al guardar puntaje del quiz' });
  }
});

// Obtener progreso diario del usuario (últimos 7 días)
app.get('/api/progress/daily/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Obtener el usuario con todos sus subjects
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Calcular los últimos 7 días
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() - i);
      dayDate.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(dayDate);
      dayEnd.setHours(23, 59, 59, 999);
      
      // Formatear el día
      const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const dayName = dayNames[dayDate.getDay()];
      const dayNumber = dayDate.getDate();
      
      days.push({
        day: `${dayName} ${dayNumber}`,
        dayStart: dayDate,
        dayEnd: dayEnd,
        subjects: {}
      });
    }
    
    // Procesar ejercicios y quizScores por día y materia
    user.subjects.forEach(subjectProgress => {
      const subjectName = subjectProgress.subjectName.toLowerCase();
      
      // Procesar ejercicios individuales
      if (subjectProgress.exercises && subjectProgress.exercises.length > 0) {
        subjectProgress.exercises.forEach(exercise => {
          const exerciseDate = new Date(exercise.attemptedAt);
          
          // Encontrar en qué día cae este ejercicio
          days.forEach(day => {
            if (exerciseDate >= day.dayStart && exerciseDate < day.dayEnd) {
              if (!day.subjects[subjectName]) {
                day.subjects[subjectName] = {
                  totalCorrect: 0,
                  totalAttempts: 0,
                  percentage: 0
                };
              }
              
              day.subjects[subjectName].totalAttempts += 1;
              if (exercise.isCorrect) {
                day.subjects[subjectName].totalCorrect += 1;
              }
            }
          });
        });
      }
      
      // Procesar quizzes
      if (subjectProgress.quizScores && subjectProgress.quizScores.length > 0) {
        subjectProgress.quizScores.forEach(quiz => {
          const quizDate = new Date(quiz.attemptedAt);
          
          // Encontrar en qué día cae este quiz
          days.forEach(day => {
            if (quizDate >= day.dayStart && quizDate < day.dayEnd) {
              if (!day.subjects[subjectName]) {
                day.subjects[subjectName] = {
                  totalCorrect: 0,
                  totalAttempts: 0,
                  percentage: 0
                };
              }
              
              // Agregar el porcentaje del quiz al promedio
              day.subjects[subjectName].totalCorrect += quiz.score;
              day.subjects[subjectName].totalAttempts += quiz.totalQuestions;
            }
          });
        });
      }
    });
    
    // Calcular porcentajes finales
    const dailyData = days.map(day => {
      const formattedDay = { day: day.day };
      
      Object.keys(day.subjects).forEach(subject => {
        const subjectData = day.subjects[subject];
        if (subjectData.totalAttempts > 0) {
          formattedDay[subject] = Math.round((subjectData.totalCorrect / subjectData.totalAttempts) * 100);
        } else {
          formattedDay[subject] = 0;
        }
      });
      
      return formattedDay;
    });
    
    res.json(dailyData);
  } catch (error) {
    console.error('Error al obtener progreso diario:', error);
    res.status(500).json({ message: 'Error al obtener progreso diario' });
  }
});

// Obtener progreso semanal del usuario
app.get('/api/progress/weekly/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Obtener el usuario con todos sus subjects
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Calcular las últimas 6 semanas
    const weeks = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      weekEnd.setHours(23, 59, 59, 999);
      
      weeks.push({
        week: `Sem ${6 - i}`,
        weekStart,
        weekEnd,
        subjects: {}
      });
    }
    
    // Procesar quizScores por semana y materia
    user.subjects.forEach(subjectProgress => {
      const subjectName = subjectProgress.subjectName.toLowerCase();
      
      subjectProgress.quizScores.forEach(quiz => {
        const quizDate = new Date(quiz.attemptedAt);
        
        // Encontrar en qué semana cae este quiz
        weeks.forEach(week => {
          if (quizDate >= week.weekStart && quizDate < week.weekEnd) {
            if (!week.subjects[subjectName]) {
              week.subjects[subjectName] = {
                totalScore: 0,
                count: 0,
                average: 0
              };
            }
            
            week.subjects[subjectName].totalScore += quiz.percentage;
            week.subjects[subjectName].count += 1;
          }
        });
      });
    });
    
    // Calcular promedios y formatear respuesta
    const weeklyData = weeks.map(week => {
      const formattedWeek = { week: week.week };
      
      Object.keys(week.subjects).forEach(subject => {
        const subjectData = week.subjects[subject];
        formattedWeek[subject] = Math.round(subjectData.totalScore / subjectData.count) || 0;
      });
      
      return formattedWeek;
    });
    
    res.json(weeklyData);
  } catch (error) {
    console.error('Error al obtener progreso semanal:', error);
    res.status(500).json({ message: 'Error al obtener progreso semanal' });
  }
});

// Obtener resumen de progreso por materia
app.get('/api/progress/summary/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    const subjectSummary = {};
    
    user.subjects.forEach(subjectProgress => {
      const subjectName = subjectProgress.subjectName;
      
      if (!subjectSummary[subjectName]) {
        subjectSummary[subjectName] = {
          name: subjectName,
          totalQuizzes: 0,
          totalScore: 0,
          totalCorrectAnswers: 0,
          totalQuestions: 0,
          averagePercentage: 0,
          completedUnits: subjectProgress.completedUnits.length,
          currentUnit: subjectProgress.currentUnit,
          lastAccessed: subjectProgress.lastAccessed
        };
      }
      
      // Calcular totales de todos los quizzes
      if (subjectProgress.quizScores && subjectProgress.quizScores.length > 0) {
        subjectProgress.quizScores.forEach(quiz => {
          subjectSummary[subjectName].totalQuizzes += 1;
          subjectSummary[subjectName].totalScore += quiz.percentage;
          subjectSummary[subjectName].totalCorrectAnswers += quiz.score;
          subjectSummary[subjectName].totalQuestions += quiz.totalQuestions;
        });
      }
    });
    
    // Calcular promedios finales
    Object.keys(subjectSummary).forEach(subject => {
      const summary = subjectSummary[subject];
      if (summary.totalQuizzes > 0) {
        summary.averagePercentage = Math.round(summary.totalScore / summary.totalQuizzes);
      }
    });
    
    res.json(Object.values(subjectSummary));
  } catch (error) {
    console.error('Error al obtener resumen de progreso:', error);
    res.status(500).json({ message: 'Error al obtener resumen de progreso' });
  }
});

app.get('/', (req, res) => res.send('API Smart Tutor 🚀'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
