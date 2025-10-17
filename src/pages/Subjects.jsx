import React, { useEffect, useState } from 'react';
import { Loader, Calculator, Atom } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserProgress, saveExercise, completeUnit } from '../services/api';
import { 
  getLocalProgress, 
  updateCorrectAnswersCount, 
  getCorrectAnswersCount,
  addExerciseToHistory,
  completeUnitLocally,
  syncWithServer 
} from '../utils/progressStorage';

const ICONS = {
  Calculator: <Calculator size={56} className="text-green-700" />,
  Atom: <Atom size={56} className="text-green-700" />,
};

const fetchUserProgress = async (subjectId) => {
  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      // Si no hay usuario logueado, retornar progreso por defecto
      return {
        currentUnit: 1,
        completedUnits: [],
        exercises: [],
        correctAnswersByUnit: {}
      };
    }

    const user = JSON.parse(userStr);
    const userId = user._id || user.id;
    
    // Primero intentar cargar desde local
    const localProgress = getLocalProgress(userId, subjectId);
    
    // Luego intentar cargar desde servidor
    let serverProgress;
    try {
      serverProgress = await getUserProgress(userId, subjectId);
    } catch (error) {
      console.warn('No se pudo cargar progreso del servidor, usando local');
      serverProgress = null;
    }
    
    // Sincronizar local con servidor
    let finalProgress;
    if (serverProgress && Object.keys(serverProgress).length > 0) {
      finalProgress = syncWithServer(userId, subjectId, serverProgress);
    } else if (localProgress) {
      finalProgress = localProgress;
    } else {
      finalProgress = {
        currentUnit: 1,
        completedUnits: [],
        exercises: [],
        correctAnswersByUnit: {}
      };
    }
    
    return {
      currentUnit: finalProgress.currentUnit || 1,
      completedUnits: finalProgress.completedUnits ? finalProgress.completedUnits.map(u => u.unitId) : [],
      exercises: finalProgress.exercises || [],
      correctAnswersByUnit: finalProgress.correctAnswersByUnit || {}
    };
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return {
      currentUnit: 1,
      completedUnits: [],
      exercises: [],
      correctAnswersByUnit: {}
    };
  }
};

const SubjectProgressCard = ({ subject }) => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('progress');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [showUnlockMessage, setShowUnlockMessage] = useState(false);
  const [usedQuestionIds, setUsedQuestionIds] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);

  const getSubjectData = (subjectName) => {
  if (subjectName === 'Física') {
    return {
      description: 'La física es el estudio de la materia, el movimiento, la energía y la fuerza. Aquí puedes explorar videos, artículos y ejercicios por tema.',
      unitTitles: [
        'Unidad 1: Movimiento en una dimensión',
        'Unidad 2: Movimiento en dos dimensiones',
        'Unidad 3: Fuerzas y leyes del movimiento de Newton',
        'Unidad 4: Fuerza centrípeta y gravitación',
        'Unidad 5: Trabajo y energía',
      ],
      lessons: [
        // Unidad 1 (sin cambios)
        [
          { type: 'video', url: 'https://youtu.be/5Q2bRM2Lj3U', title: 'Introducción a la física: Movimiento en una dimensión' },
          'Desplazamiento, velocidad y tiempo',
          'Aceleración y movimiento uniformemente acelerado',
          'Caída libre y tiro vertical',
          'Gráficas de movimiento'
        ],
        // ✅ Unidad 2 — NUEVO VIDEO
        [
          { type: 'video', url: 'https://youtu.be/IvxFRJcWZbQ', title: 'La refracción y la ley de Snell' },
          'Índice de refracción',
          'Aplicaciones de la ley de Snell',
          'Reflexión total interna',
          'Lentes y formación de imágenes'
        ],
        // Unidades 3-5 (puedes mantenerlas o ajustarlas)
        [
          'Primera ley de Newton (inercia)',
          'Segunda ley de Newton (F = ma)',
          'Tercera ley de Newton (acción-reacción)',
          'Fuerza normal y tensión',
          'Fricción y planos inclinados'
        ],
        [
          'Movimiento circular uniforme',
          'Aceleración centrípeta',
          'Ley de gravitación universal'
        ],
        [
          'Trabajo mecánico',
          'Energía cinética y potencial',
          'Teorema del trabajo y la energía',
          'Potencia'
        ],
      ],
      quizzes: {
        // Unidad 1 - Banco de preguntas
        1: [
          {
            id: 1,
            question: "¿Qué magnitud física describe el cambio de posición de un objeto?",
            options: ["Velocidad", "Aceleración", "Desplazamiento", "Tiempo"],
            correct: 2,
            explanation: "El desplazamiento es el cambio de posición de un objeto respecto a un punto de referencia."
          },
          {
            id: 2,
            question: "Si un objeto se mueve con velocidad constante, ¿qué valor tiene su aceleración?",
            options: ["Positiva", "Negativa", "Cero", "Variable"],
            correct: 2,
            explanation: "Cuando un objeto se mueve con velocidad constante, su aceleración es cero porque no hay cambio en la velocidad."
          },
          {
            id: 3,
            question: "¿Qué tipo de movimiento tiene una pelota en caída libre?",
            options: ["Movimiento rectilíneo uniforme", "Movimiento circular", "Movimiento rectilíneo uniformemente acelerado", "Movimiento parabólico"],
            correct: 2,
            explanation: "La caída libre es un movimiento rectilíneo uniformemente acelerado con aceleración igual a la gravedad (g ≈ 9.8 m/s²)."
          },
          {
            id: 4,
            question: "¿Cuál es la unidad de velocidad en el Sistema Internacional?",
            options: ["km/h", "m/s", "cm/s", "mph"],
            correct: 1,
            explanation: "La unidad de velocidad en el SI es metros por segundo (m/s)."
          },
          {
            id: 5,
            question: "¿Qué representa la pendiente en una gráfica posición-tiempo?",
            options: ["Aceleración", "Velocidad", "Desplazamiento", "Tiempo"],
            correct: 1,
            explanation: "En una gráfica posición-tiempo, la pendiente representa la velocidad del objeto."
          }
        ],
        // Unidad 2 - Banco de preguntas
        2: [
          {
            id: 1,
            question: "¿Qué establece la ley de Snell?",
            options: [
              "La relación entre ángulo de incidencia y ángulo de reflexión",
              "La relación entre los índices de refracción y los ángulos de incidencia y refracción",
              "La velocidad de la luz en el vacío",
              "La energía de un fotón"
            ],
            correct: 1,
            explanation: "La ley de Snell establece que n₁·sen(θ₁) = n₂·sen(θ₂), donde n es el índice de refracción y θ los ángulos."
          }
        ]
      }
    };
  } else if (subjectName === 'Matemáticas') {
    return {
      description: 'Domina los fundamentos del razonamiento matemático, desde el álgebra hasta el cálculo diferencial, paso a paso.',
      unitTitles: [
        'Unidad 1: Álgebra básica',
        'Unidad 2: Ecuaciones y funciones',
        'Unidad 3: Geometría analítica',
        'Unidad 4: Trigonometría',
        'Unidad 5: Cálculo diferencial',
      ],
      lessons: [
        // Unidad 1 (sin cambios)
        [
          { type: 'video', url: 'https://youtu.be/EKeMeKv8c-I', title: 'Números reales y propiedades' },
          'Operaciones con polinomios',
          'Productos notables',
          'Factorización básica',
          'Fracciones algebraicas'
        ],
        // ✅ Unidad 2 — NUEVO VIDEO
        [
          { type: 'video', url: 'https://youtu.be/o70Gpg1bVNc', title: 'Introducción a las ecuaciones lineales de dos variables' },
          'Forma estándar y pendiente-intersección',
          'Gráfica de ecuaciones lineales',
          'Sistemas de ecuaciones 2x2',
          'Método de sustitución y eliminación'
        ],
        // Unidades 3-5 (sin cambios)
        [
          'Distancia entre dos puntos',
          'Punto medio y pendiente',
          'Ecuación de la recta (forma punto-pendiente)',
          'Circunferencia: ecuación canónica',
          'Parábola y sus elementos'
        ],
        [
          'Razones trigonométricas (seno, coseno, tangente)',
          'Resolución de triángulos rectángulos',
          'Ley de senos y ley de cosenos',
          'Funciones trigonométricas en el círculo unitario',
          'Identidades trigonométricas básicas'
        ],
        [
          'Concepto de límite',
          'Límites laterales y continuidad',
          'Derivada como razón de cambio',
          'Reglas de derivación (potencia, suma, producto)',
          'Aplicaciones: máximos y mínimos'
        ],
      ],
      quizzes: {
        // Unidad 1 - Banco de preguntas
        1: [
          {
            id: 1,
            question: "¿Cuál de los siguientes NO es un número real?",
            options: ["√4", "π", "√(-1)", "-3.5"],
            correct: 2,
            explanation: "√(-1) es un número imaginario, no pertenece al conjunto de los números reales."
          },
          {
            id: 2,
            question: "¿Cuál es el resultado de (x + 3)(x - 3)?",
            options: ["x² - 9", "x² + 9", "x² - 6x + 9", "x² + 6x - 9"],
            correct: 0,
            explanation: "Es un producto notable: diferencia de cuadrados (a + b)(a - b) = a² - b²"
          },
          {
            id: 3,
            question: "¿Cómo se factoriza x² + 5x + 6?",
            options: ["(x + 2)(x + 3)", "(x - 2)(x - 3)", "(x + 1)(x + 6)", "(x - 1)(x - 6)"],
            correct: 0,
            explanation: "x² + 5x + 6 = (x + 2)(x + 3) porque 2 + 3 = 5 y 2 × 3 = 6"
          },
          {
            id: 4,
            question: "¿Cuál es el valor de x en la ecuación 2x + 5 = 13?",
            options: ["x = 4", "x = 8", "x = 9", "x = 6"],
            correct: 0,
            explanation: "2x + 5 = 13 → 2x = 8 → x = 4"
          },
          {
            id: 5,
            question: "¿Qué propiedad se aplica en a(b + c) = ab + ac?",
            options: ["Propiedad conmutativa", "Propiedad distributiva", "Propiedad asociativa", "Propiedad del elemento neutro"],
            correct: 1,
            explanation: "Esta es la propiedad distributiva de la multiplicación respecto a la suma."
          }
        ],
        // Unidad 2 - Banco de preguntas
        2: [
          {
            id: 1,
            question: "¿Cuál de las siguientes es una ecuación lineal en dos variables?",
            options: [
              "x² + y = 5",
              "xy = 6",
              "2x + 3y = 7",
              "x + y² = 4"
            ],
            correct: 2,
            explanation: "Una ecuación lineal en dos variables tiene la forma ax + by = c, donde a, b, c son constantes y las variables tienen exponente 1."
          }
        ]
      }
    };
  } else {
    const titles = ['Unidad 1', 'Unidad 2', 'Unidad 3', 'Unidad 4', 'Unidad 5'];
    const lessons = titles.map(() => ['Lección introductoria']);
    return {
      description: `Contenido introductorio de ${subjectName}.`,
      unitTitles: titles,
      lessons,
      quizzes: {}
    };
  }
  };

  useEffect(() => {
    const loadData = async () => {
      const { unitTitles, lessons } = getSubjectData(subject.nombre);

      try {
        const progress = await fetchUserProgress(subject._id);
        const mappedUnits = unitTitles.map((title, index) => ({
          id: index + 1,
          title,
          lessons: lessons[index] || [],
          completed: progress.completedUnits.includes(index + 1),
          current: progress.currentUnit === index + 1,
        }));
        setUnits(mappedUnits);
        
        // Cargar el contador de respuestas correctas desde el progreso guardado
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          const userId = user._id || user.id;
          
          // Cargar contador de respuestas correctas por unidad
          if (progress.correctAnswersByUnit) {
            Object.keys(progress.correctAnswersByUnit).forEach(unitId => {
              if (parseInt(unitId) === progress.currentUnit) {
                setCorrectAnswersCount(progress.correctAnswersByUnit[unitId]);
              }
            });
          } else if (progress.exercises && progress.exercises.length > 0) {
            // Fallback: contar desde ejercicios si no existe correctAnswersByUnit
            const currentUnitCorrectAnswers = progress.exercises.filter(
              ex => ex.unitId === progress.currentUnit && ex.isCorrect
            ).length;
            setCorrectAnswersCount(currentUnitCorrectAnswers);
            
            // Guardar en el nuevo formato
            updateCorrectAnswersCount(userId, subject._id, subject.nombre, progress.currentUnit, currentUnitCorrectAnswers);
          }
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
        const fallbackUnits = unitTitles.map((title, index) => ({
          id: index + 1,
          title,
          lessons: lessons[index] || [],
          completed: false,
          current: index === 0,
        }));
        setUnits(fallbackUnits);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [subject]);

  const handleContinue = async (unitId) => {
    setViewMode({ type: 'unit', id: unitId });
    setSelectedAnswer(null);
    setShowFeedback(false);
    setUsedQuestionIds([]);
    setCurrentQuiz(null);
    setQuizHistory([]);
    
    // Cargar el progreso de esta unidad específica (local primero)
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const userId = user._id || user.id;
        
        // Cargar contador de respuestas correctas desde localStorage
        const savedCount = getCorrectAnswersCount(userId, subject._id, unitId);
        setCorrectAnswersCount(savedCount);
        
        // Cargar progreso completo para historial
        const progress = await fetchUserProgress(subject._id);
        if (progress.exercises && progress.exercises.length > 0) {
          // Cargar historial de esta unidad
          const unitHistory = progress.exercises
            .filter(ex => ex.unitId === unitId)
            .map(ex => ({
              questionId: ex.questionId || 0,
              question: ex.question,
              selectedAnswer: ex.answer,
              correctAnswer: ex.correctAnswer || '',
              isCorrect: ex.isCorrect,
              timestamp: ex.attemptedAt
            }));
          setQuizHistory(unitHistory);
        }
      } else {
        setCorrectAnswersCount(0);
      }
    } catch (error) {
      console.error('Error cargando progreso de unidad:', error);
      setCorrectAnswersCount(0);
    }
    
    // Load first random quiz
    loadRandomQuiz(unitId);
  };

  const handleViewAll = () => {
    setViewMode('welcome');
    setSelectedAnswer(null);
    setShowFeedback(false);
    setUsedQuestionIds([]);
    setCorrectAnswersCount(0);
    setCurrentQuiz(null);
    setQuizHistory([]);
  };

  const handleBackToProgress = () => {
    setViewMode('progress');
    setSelectedAnswer(null);
    setShowFeedback(false);
    setUsedQuestionIds([]);
    setCorrectAnswersCount(0);
    setCurrentQuiz(null);
    setQuizHistory([]);
  };

  // Función para cargar una pregunta aleatoria sin repetir
  const loadRandomQuiz = (unitId) => {
    const { quizzes = {} } = getSubjectData(subject.nombre);
    const availableQuizzes = quizzes[unitId];
    
    if (!availableQuizzes || availableQuizzes.length === 0) {
      setCurrentQuiz(null);
      return;
    }

    // Filtrar preguntas no usadas
    const unusedQuizzes = availableQuizzes.filter(
      quiz => !usedQuestionIds.includes(quiz.id)
    );

    // Si ya se usaron todas, reiniciar el banco de preguntas
    if (unusedQuizzes.length === 0) {
      setUsedQuestionIds([]);
      const randomIndex = Math.floor(Math.random() * availableQuizzes.length);
      const selectedQuiz = availableQuizzes[randomIndex];
      setCurrentQuiz(selectedQuiz);
      setUsedQuestionIds([selectedQuiz.id]);
    } else {
      // Seleccionar una pregunta aleatoria de las no usadas
      const randomIndex = Math.floor(Math.random() * unusedQuizzes.length);
      const selectedQuiz = unusedQuizzes[randomIndex];
      setCurrentQuiz(selectedQuiz);
      setUsedQuestionIds(prev => [...prev, selectedQuiz.id]);
    }
  };

  const handleAnswerSelect = (index) => {
    if (!showFeedback) setSelectedAnswer(index);
  };

  const handleSubmit = async (quiz) => {
    setShowFeedback(true);
    
    const isCorrect = selectedAnswer === quiz.correct;
    const attemptData = {
      questionId: quiz.id,
      question: quiz.question,
      selectedAnswer: quiz.options[selectedAnswer],
      correctAnswer: quiz.options[quiz.correct],
      isCorrect,
      timestamp: new Date().toISOString(),
      unitId: viewMode.id
    };
    
    // Guardar en el historial local
    setQuizHistory(prev => [...prev, attemptData]);
    
    // Guardar en localStorage como respaldo
    const savedHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    savedHistory.push({
      ...attemptData,
      subjectName: subject.nombre,
      unitId: viewMode.id
    });
    localStorage.setItem('quizHistory', JSON.stringify(savedHistory));
    
    // Obtener información del usuario
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    let userId = null;
    
    if (userStr) {
      const user = JSON.parse(userStr);
      userId = user._id || user.id;
      
      // Guardar ejercicio en localStorage (progreso local)
      addExerciseToHistory(userId, subject._id, subject.nombre, attemptData);
    }
    
    // Guardar en MongoDB (si hay conexión)
    if (token && userId) {
      try {
        await saveExercise(
          userId,
          subject._id,
          subject.nombre,
          viewMode.id,
          quiz.question,
          quiz.options[selectedAnswer],
          isCorrect
        );
      } catch (error) {
        console.warn('No se pudo guardar en servidor, pero está guardado localmente:', error);
      }
    }
    
    // Si la respuesta es correcta, incrementar el contador
    if (isCorrect) {
      const newCount = correctAnswersCount + 1;
      setCorrectAnswersCount(newCount);
      
      // Actualizar contador en localStorage
      if (userId) {
        updateCorrectAnswersCount(userId, subject._id, subject.nombre, viewMode.id, newCount);
      }
      
      // Si alcanzó 3 respuestas correctas, desbloquear siguiente unidad
      if (newCount >= 3) {
        setShowUnlockMessage(true);
        
        // Completar unidad localmente
        if (userId) {
          completeUnitLocally(userId, subject._id, subject.nombre, viewMode.id);
        }
        
        // Guardar completación de unidad en MongoDB (si hay conexión)
        if (token && userId) {
          try {
            await completeUnit(
              userId,
              subject._id,
              subject.nombre,
              viewMode.id
            );
          } catch (error) {
            console.warn('No se pudo guardar completación en servidor, pero está guardada localmente:', error);
          }
        }
        
        // Actualizar las unidades para desbloquear la siguiente
        setTimeout(() => {
          setUnits(prevUnits => prevUnits.map(unit => {
            if (unit.id === viewMode.id) {
              return { ...unit, completed: true, current: false };
            }
            if (unit.id === viewMode.id + 1) {
              return { ...unit, current: true };
            }
            return unit;
          }));
          
          // Después de 2 segundos más, cambiar a la vista de progreso
          setTimeout(() => {
            setShowUnlockMessage(false);
            setViewMode('progress');
            setSelectedAnswer(null);
            setShowFeedback(false);
          }, 2000);
        }, 1500);
      } else {
        // Cargar siguiente pregunta después de mostrar feedback
        setTimeout(() => {
          setSelectedAnswer(null);
          setShowFeedback(false);
          loadRandomQuiz(viewMode.id);
        }, 2000);
      }
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    // Cargar una nueva pregunta aleatoria
    loadRandomQuiz(viewMode.id);
  };

  const renderLesson = (lesson, idx, isUnitView = false) => {
    if (typeof lesson === 'string') {
      return isUnitView ? (
        <div key={idx} className="p-3 bg-gray-50 rounded text-gray-700">
          {lesson}
        </div>
      ) : (
        <div key={idx}>{lesson}</div>
      );
    } else if (lesson && lesson.type === 'video') {
      let videoId = '';
      if (lesson.url.includes('youtu.be/')) {
        videoId = lesson.url.split('youtu.be/')[1]?.split('?')[0];
      } else if (lesson.url.includes('youtube.com/watch')) {
        videoId = lesson.url.split('v=')[1]?.split('&')[0];
      }

      return (
        <div key={idx} className={isUnitView ? 'space-y-2' : 'space-y-1'}>
          <div className={isUnitView ? 'font-medium text-gray-800' : 'font-medium'}>
            {lesson.title}
          </div>
          {videoId ? (
            <div className="aspect-video w-full max-w-3xl bg-black rounded">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={lesson.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full rounded"
              />
            </div>
          ) : (
            <div className={isUnitView ? 'text-red-500 p-3 bg-gray-50 rounded' : 'text-red-500'}>
              Video no disponible
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'welcome') {
    const { description } = getSubjectData(subject.nombre);
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <button
          onClick={handleBackToProgress}
          className="mb-4 text-[#4caf50] hover:text-[#2e7d32] flex items-center gap-1"
        >
          ← Volver al progreso
        </button>
        <h2 className="text-2xl font-bold text-[#2e7d32] mb-4">
          ¡Bienvenido a las Lecciones de {subject.nombre.toLowerCase()}!
        </h2>
        <p className="mb-6 text-gray-700">{description}</p>

        <div className="space-y-4">
          {units.map((unit) => (
            <div key={unit.id} className="p-4 border rounded-lg border-gray-200">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-[#2e7d32] rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-bold">{unit.id}</span>
                </div>
                <h3 className="text-lg font-semibold text-[#2e7d32]">{unit.title}</h3>
              </div>
              <div className="space-y-1 text-sm text-gray-700">
                {unit.lessons.map((lesson, idx) => renderLesson(lesson, idx, false))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (viewMode.type === 'unit') {
    const unit = units.find((u) => u.id === viewMode.id);
    if (!unit) return <div className="p-6">Unidad no encontrada</div>;

    const { quizzes = {} } = getSubjectData(subject.nombre);
    const hasQuizzes = quizzes[viewMode.id] && quizzes[viewMode.id].length > 0;

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <button
          onClick={handleBackToProgress}
          className="mb-4 text-[#4caf50] hover:text-[#2e7d32] flex items-center gap-1"
        >
          ← Volver al progreso
        </button>
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-[#2e7d32] rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold">{unit.id}</span>
          </div>
          <h2 className="text-xl font-bold text-[#2e7d32]">{unit.title}</h2>
        </div>
        <div className="space-y-2">
          {unit.lessons.map((lesson, idx) => renderLesson(lesson, idx, true))}
        </div>

        {/* Quiz con preguntas aleatorias */}
        {hasQuizzes && currentQuiz && (
          <div className="mt-8 p-4 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg text-[#2e7d32]">Ejercicio de práctica</h3>
              <div className="text-sm text-gray-600">
                Respuestas correctas: <span className="font-bold text-[#2e7d32]">{correctAnswersCount}/3</span>
              </div>
            </div>
            
            {showUnlockMessage && (
              <div className="mb-4 p-4 bg-green-600 text-white rounded-lg animate-pulse">
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-bold">¡Felicidades! Has desbloqueado la Unidad 2</span>
                </div>
              </div>
            )}
            
            <p className="mb-4">{currentQuiz.question}</p>
            <div className="space-y-2 mb-4">
              {currentQuiz.options.map((option, idx) => {
                let bgColor = 'bg-white';
                let border = 'border-gray-300';
                if (showFeedback) {
                  if (idx === currentQuiz.correct) {
                    bgColor = 'bg-green-100';
                    border = 'border-green-500';
                  } else if (selectedAnswer === idx) {
                    bgColor = 'bg-red-100';
                    border = 'border-red-500';
                  }
                } else if (selectedAnswer === idx) {
                  bgColor = 'bg-blue-50';
                  border = 'border-blue-500';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    disabled={showFeedback}
                    className={`w-full text-left p-3 rounded border ${border} ${bgColor} transition-colors`}
                  >
                    {String.fromCharCode(65 + idx)}. {option}
                  </button>
                );
              })}
            </div>

            {!showFeedback ? (
              <button
                onClick={() => handleSubmit(currentQuiz)}
                disabled={selectedAnswer === null}
                className={`px-4 py-2 rounded font-medium ${
                  selectedAnswer === null
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#2e7d32] hover:bg-[#1b5e20] text-white'
                }`}
              >
                Verificar respuesta
              </button>
            ) : (
              <div className="space-y-3">
                {selectedAnswer === currentQuiz.correct ? (
                  <div className="text-green-700 font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    ¡Correcto! {correctAnswersCount >= 3 ? '¡Has completado esta unidad!' : `Te faltan ${3 - correctAnswersCount} respuestas correctas para avanzar.`}
                  </div>
                ) : (
                  <div className="text-red-700 font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Incorrecto. La respuesta correcta es: {currentQuiz.options[currentQuiz.correct]}
                  </div>
                )}
                <p className="text-sm text-gray-700">{currentQuiz.explanation}</p>
                {!showUnlockMessage && selectedAnswer !== currentQuiz.correct && (
                  <button
                    onClick={handleResetQuiz}
                    className="mt-2 text-[#4caf50] hover:text-[#2e7d32] font-medium"
                  >
                    Intentar nueva pregunta
                  </button>
                )}
              </div>
            )}
            
            {/* Mostrar historial de respuestas */}
            {quizHistory.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Historial de respuestas:</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  {quizHistory.map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      {entry.isCorrect ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-red-600">✗</span>
                      )}
                      <span>Pregunta {idx + 1}: {entry.isCorrect ? 'Correcta' : 'Incorrecta'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#333333]">
          Lecciones de {subject.nombre.toLowerCase()}
        </h2>
        <button
          onClick={handleViewAll}
          className="text-[#4caf50] hover:text-[#2e7d32] font-medium"
        >
          Ver todos ({units.length})
        </button>
      </div>

      <div className="space-y-4">
        {units.map((unit, index) => (
          <motion.div
            key={unit.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between py-3 border-b border-[#c8e6c9] last:border-b-0"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  unit.completed
                    ? 'bg-[#2e7d32]'
                    : unit.current
                    ? 'bg-[#4caf50]'
                    : 'bg-[#c8e6c9]'
                }`}
              >
                {unit.completed ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="white"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                  </svg>
                ) : (
                  <span className="text-[#333333] font-medium">{unit.id}</span>
                )}
              </div>
              <span
                className={`font-medium ${
                  unit.completed || unit.current ? 'text-[#333333]' : 'text-gray-400'
                }`}
              >
                {unit.title}
              </span>
            </div>

            {unit.current && (
              <button
                onClick={() => handleContinue(unit.id)}
                className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 whitespace-nowrap"
              >
                Continuar
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const fetchSubjects = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockSubjects = [
        {
          _id: '60a7d5b1b4f4e7c3e3a4b6c1',
          nombre: 'Matemáticas',
          descripcion: 'Aprende los fundamentos de la matemática.',
          icono: 'Calculator',
          nivel: 'Básico',
          temas: ['Álgebra', 'Geometría', 'Cálculo'],
          estudiantes: 120,
        },
        {
          _id: '60a7d5b1b4f4e7c3e3a4b6c2',
          nombre: 'Física',
          descripcion: 'Explora los principios de la física.',
          icono: 'Atom',
          nivel: 'Avanzado',
          temas: ['Mecánica', 'Óptica', 'Termodinámica'],
          estudiantes: 80,
        },
      ];
      resolve(mockSubjects);
    }, 500);
  });
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    fetchSubjects()
      .then((data) => {
        setSubjects(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching mock subjects:', error);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin" size={32} />
        <span className="ml-2">Cargando materias...</span>
      </div>
    );

  if (selectedSubject) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setSelectedSubject(null)}
            className="mb-6 text-[#4caf50] hover:text-[#2e7d32] font-medium flex items-center gap-2"
          >
            ← Volver a materias
          </button>
          <h1 className="text-3xl font-bold text-[#333333] mb-6">{selectedSubject.nombre}</h1>
          <SubjectProgressCard subject={selectedSubject} />
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <h2 className="text-lg font-semibold mb-1">Elige tu Materia</h2>
      <p className="mb-6 text-gray-600">
        Selecciona la materia que deseas estudiar y comienza tu camino de aprendizaje
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((subject) => (
          <div
            key={subject._id}
            className="rounded-2xl shadow-md border bg-white overflow-hidden flex flex-col"
          >
            <div
              className="relative flex flex-col items-center justify-center py-8"
              style={{
                background: subject.nivel === 'Avanzado' ? '#b2dfdb' : '#dcedc8',
              }}
            >
              {ICONS[subject.icono] || (
                subject.icono && subject.icono.startsWith('http') ? (
                  <img
                    src={subject.icono}
                    alt={subject.nombre}
                    className="w-14 h-14 object-contain"
                  />
                ) : (
                  <span className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                    ?
                  </span>
                )
              )}
              <span className="absolute top-4 right-4 bg-white text-xs px-3 py-1 rounded-full shadow text-gray-700 border">
                {subject.nivel}
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-base font-bold mb-1">{subject.nombre}</h3>
              <p className="text-gray-700 mb-2 text-sm">{subject.descripcion}</p>
              <div className="mb-2">
                <span className="text-xs text-gray-500">Temas principales:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {subject.temas.map((tema, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 px-2 py-1 rounded text-xs border border-gray-200"
                    >
                      {tema}
                    </span>
                  ))}
                </div>
              </div>
              <hr className="my-2" />
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <span className="mr-2">👥</span>
                {subject.estudiantes} estudiantes
              </div>
              <button
                onClick={() => setSelectedSubject(subject)}
                className="w-full mt-4 py-2 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Comenzar a estudiar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}