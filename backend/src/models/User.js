import mongoose from "mongoose";

// ----------------------
// 1️⃣ Sub-esquema para el progreso de cada materia
// ----------------------
const progressSchema = new mongoose.Schema({
  subjectId: { type: String, required: true }, // ID de la materia
  subjectName: { type: String, required: true }, // Nombre de la materia
  currentUnit: { type: Number, default: 1 }, // Unidad actual
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
});

// ----------------------
// 2️⃣ Esquema principal de usuario
// ----------------------
const userSchema = new mongoose.Schema({
  dni: String,
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "tutor", "admin"], default: "student" },
  subjects: [progressSchema], // 👈 Aquí se guarda el progreso detallado de cada materia
  createdAt: { type: Date, default: Date.now }
});

// ----------------------
// 3️⃣ Exportar el modelo
// ----------------------
export default mongoose.model("User", userSchema);