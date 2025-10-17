const API_URL = "http://localhost:5000/api";

// Obtener usuario autenticado
export const getCurrentUser = async (token) => {
  const res = await fetch(`${API_URL}/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
};

// Obtener progreso del usuario para una materia
export const getUserProgress = async (userId, subjectId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/progress/${userId}/${subjectId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
};

// Guardar respuesta de ejercicio
export const saveExercise = async (userId, subjectId, subjectName, unitId, question, answer, isCorrect) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/progress/save-exercise`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ userId, subjectId, subjectName, unitId, question, answer, isCorrect })
  });
  return res.json();
};

// Completar unidad
export const completeUnit = async (userId, subjectId, subjectName, unitId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/progress/complete-unit`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ userId, subjectId, subjectName, unitId })
  });
  return res.json();
};

// Guardar puntaje de quiz
export const saveQuizScore = async (userId, subjectId, subjectName, unitId, score, totalQuestions) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/progress/save-quiz-score`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ userId, subjectId, subjectName, unitId, score, totalQuestions })
  });
  return res.json();
};

// Obtener progreso diario del usuario
export const getDailyProgress = async (userId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/progress/daily/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
};

// Obtener progreso semanal del usuario
export const getWeeklyProgress = async (userId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/progress/weekly/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
};

// Obtener resumen de progreso por materia
export const getProgressSummary = async (userId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/progress/summary/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
};

export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};
