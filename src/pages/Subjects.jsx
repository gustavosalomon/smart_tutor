import React, { useEffect, useState } from 'react';
import { Loader, Calculator, Atom } from 'lucide-react';
import { motion } from 'framer-motion';

const ICONS = {
  Calculator: <Calculator size={56} className="text-green-700" />,
  Atom: <Atom size={56} className="text-green-700" />,
};

const fetchUserProgress = async (subjectId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockProgress = {
        currentUnit: 1,
        completedUnits: []
      };
      resolve(mockProgress);
    }, 300);
  });
};

const SubjectProgressCard = ({ subject }) => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('progress');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

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
        // Unidad 1 (sin cambios)
        1: {
          question: "¿Qué magnitud física describe el cambio de posición de un objeto?",
          options: ["Velocidad", "Aceleración", "Desplazamiento", "Tiempo"],
          correct: 2,
          explanation: "El desplazamiento es el cambio de posición de un objeto respecto a un punto de referencia."
        },
        // ✅ Unidad 2 — NUEVO QUIZ
        2: {
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
        // Unidad 1 (sin cambios)
        1: {
          question: "¿Cuál de los siguientes NO es un número real?",
          options: ["√4", "π", "√(-1)", "-3.5"],
          correct: 2,
          explanation: "√(-1) es un número imaginario, no pertenece al conjunto de los números reales."
        },
        // ✅ Unidad 2 — NUEVO QUIZ
        2: {
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
      const { unitTitles, lessons, quizzes = {} } = getSubjectData(subject.nombre);

      try {
        const progress = await fetchUserProgress(subject._id);
        const mappedUnits = unitTitles.map((title, index) => ({
          id: index + 1,
          title,
          lessons: lessons[index] || [],
          quiz: quizzes[index + 1] || null,
          completed: progress.completedUnits.includes(index + 1),
          current: progress.currentUnit === index + 1,
        }));
        setUnits(mappedUnits);
      } catch (error) {
        console.error('Error fetching progress:', error);
        const fallbackUnits = unitTitles.map((title, index) => ({
          id: index + 1,
          title,
          lessons: lessons[index] || [],
          quiz: quizzes[index + 1] || null,
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

  const handleContinue = (unitId) => {
    setViewMode({ type: 'unit', id: unitId });
    // Reset quiz state when changing unit
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handleViewAll = () => {
    setViewMode('welcome');
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handleBackToProgress = () => {
    setViewMode('progress');
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };

  const handleSubmit = (quiz) => {
    setShowFeedback(true);
  };

  const handleResetQuiz = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
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

    const { quiz } = unit;

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

        {/* Quiz solo para Unidad 1 */}
        {quiz && (
          <div className="mt-8 p-4 border border-green-200 bg-green-50 rounded-lg">
            <h3 className="font-bold text-lg text-[#2e7d32] mb-3">Ejercicio de práctica</h3>
            <p className="mb-4">{quiz.question}</p>
            <div className="space-y-2 mb-4">
              {quiz.options.map((option, idx) => {
                let bgColor = 'bg-white';
                let border = 'border-gray-300';
                if (showFeedback) {
                  if (idx === quiz.correct) {
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
                    onClick={() => !showFeedback && handleAnswerSelect(idx)}
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
                onClick={() => handleSubmit(quiz)}
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
                {selectedAnswer === quiz.correct ? (
                  <div className="text-green-700 font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    ¡Correcto!
                  </div>
                ) : (
                  <div className="text-red-700 font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Incorrecto. La respuesta correcta es: {quiz.options[quiz.correct]}
                  </div>
                )}
                <p className="text-sm text-gray-700">{quiz.explanation}</p>
                <button
                  onClick={handleResetQuiz}
                  className="mt-2 text-[#4caf50] hover:text-[#2e7d32] font-medium"
                >
                  Intentar de nuevo
                </button>
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
                banner: '/banner_mat.jpeg',
                nivel: 'Básico',
                temas: ['Álgebra', 'Geometría', 'Cálculo'],
                estudiantes: 120,
              },
              {
                _id: '60a7d5b1b4f4e7c3e3a4b6c2',
                nombre: 'Física',
                descripcion: 'Explora los principios de la física.',
                banner: '/banner_fisica.jpg',
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
            {/* Banner superior */}
            <div className="relative">
              {/* Botón de nivel arriba del banner */}
              <span className="absolute top-4 right-4 z-10 bg-white text-xs px-3 py-1 rounded-full shadow text-gray-700 border">
                {subject.nivel}
              </span>
              {subject.banner ? (
                <img
                  src={subject.banner}
                  alt={`Banner de ${subject.nombre}`}
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div
                  className="flex flex-col items-center justify-center py-8"
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
                </div>
              )}
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