import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, CheckCircle, Target, Award, Calendar, Loader } from 'lucide-react';
import { getProgressSummary } from '../services/api';
import { getAllLocalProgress } from '../utils/progressStorage';

export default function TrackingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subjectProgress, setSubjectProgress] = useState([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalCorrectAnswers: 0,
    totalQuestions: 0,
    completedUnits: 0,
    averageScore: 0
  });

  useEffect(() => {
    const fetchDetailedProgress = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          console.warn('Usuario no autenticado');
          navigate('/');
          return;
        }

        const user = JSON.parse(userStr);
        const userId = user._id || user.id;

        // Obtener progreso del servidor
        let serverSummary = [];
        try {
          serverSummary = await getProgressSummary(userId);
          if (!serverSummary || !Array.isArray(serverSummary)) {
            serverSummary = [];
          }
        } catch (error) {
          console.warn('No se pudo cargar progreso del servidor:', error);
        }

        // Obtener progreso local
        const localProgress = getAllLocalProgress(userId);
        
        // Combinar y sincronizar progreso
        const combinedProgress = [];
        const processedSubjects = new Set();

        // Procesar progreso del servidor
        serverSummary.forEach(subject => {
          combinedProgress.push(subject);
          processedSubjects.add(subject.name);
        });

        // Agregar progreso local que no esté en el servidor
        Object.keys(localProgress).forEach(subjectId => {
          const localSubject = localProgress[subjectId];
          
          // Obtener el nombre de la materia
          const subjectName = localSubject.subjectName || 'Materia Desconocida';

          // Si no está procesada, agregar
          if (!processedSubjects.has(subjectName)) {
            const exercises = localSubject.exercises || [];
            const correctExercises = exercises.filter(ex => ex.isCorrect).length;
            const totalExercises = exercises.length;
            const percentage = totalExercises > 0 ? Math.round((correctExercises / totalExercises) * 100) : 0;

            combinedProgress.push({
              name: subjectName,
              totalQuizzes: totalExercises,
              totalScore: 0,
              totalCorrectAnswers: correctExercises,
              totalQuestions: totalExercises,
              averagePercentage: percentage,
              completedUnits: localSubject.completedUnits ? localSubject.completedUnits.length : 0,
              currentUnit: localSubject.currentUnit || 1,
              lastAccessed: localSubject.lastUpdated || new Date().toISOString(),
              isLocal: true
            });
            processedSubjects.add(subjectName);
          }
        });

        setSubjectProgress(combinedProgress);

        // Calcular estadísticas generales (incluyendo datos locales)
        let totalQuizzes = 0;
        let totalCorrect = 0;
        let totalQuestions = 0;
        let totalUnits = 0;
        let totalPercentage = 0;

        combinedProgress.forEach(subject => {
          totalQuizzes += subject.totalQuizzes;
          totalUnits += subject.completedUnits;
          totalPercentage += subject.averagePercentage;
          totalCorrect += subject.totalCorrectAnswers || 0;
          totalQuestions += subject.totalQuestions || 0;
        });

        const avgPercentage = combinedProgress.length > 0 ? totalPercentage / combinedProgress.length : 0;
        
        setStats({
          totalQuizzes,
          totalCorrectAnswers: totalCorrect,
          totalQuestions: totalQuestions,
          completedUnits: totalUnits,
          averageScore: Math.round(avgPercentage)
        });

        setLoading(false);
      } catch (error) {
        console.error('Error al obtener progreso detallado:', error);
        setSubjectProgress([]);
        setLoading(false);
      }
    };

    fetchDetailedProgress();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader className="animate-spin text-green-600" size={32} />
          <span className="text-gray-600">Cargando estadísticas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft size={20} />
            <span>Volver al Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-green-700" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Seguimiento Personalizado</h1>
              <p className="text-gray-600">Monitorea tu progreso y rendimiento académico</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Estadísticas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total de Quizzes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="text-blue-600" size={20} />
              </div>
              <span className="text-xs text-gray-500">Total</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalQuizzes}</h3>
            <p className="text-sm text-gray-600 mt-1">Quizzes Completados</p>
          </div>

          {/* Respuestas Correctas */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <span className="text-xs text-gray-500">Aciertos</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalCorrectAnswers}</h3>
            <p className="text-sm text-gray-600 mt-1">Respuestas Correctas</p>
            <p className="text-xs text-green-600 mt-1">de {stats.totalQuestions} preguntas</p>
          </div>

          {/* Unidades Aprobadas */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="text-purple-600" size={20} />
              </div>
              <span className="text-xs text-gray-500">Logros</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.completedUnits}</h3>
            <p className="text-sm text-gray-600 mt-1">Unidades Aprobadas</p>
          </div>

          {/* Promedio General */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-yellow-600" size={20} />
              </div>
              <span className="text-xs text-gray-500">Rendimiento</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.averageScore}%</h3>
            <p className="text-sm text-gray-600 mt-1">Promedio General</p>
          </div>
        </div>

        {/* Detalle por Materia */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="text-green-600" size={24} />
            Progreso Detallado por Materia
          </h2>

          {subjectProgress.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No hay datos de progreso disponibles.</p>
              <p className="text-sm mt-2">Completa algunos quizzes para ver tus estadísticas aquí.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Array.isArray(subjectProgress) && subjectProgress.map((subject, index) => {
                const correctAnswers = subject.totalCorrectAnswers || 0;

                return (
                  <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                          {subject.isLocal && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              📱 Local
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          Última actividad: {new Date(subject.lastAccessed).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        subject.averagePercentage >= 80 
                          ? 'bg-green-100 text-green-700'
                          : subject.averagePercentage >= 60
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {subject.averagePercentage}%
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Quizzes</p>
                        <p className="text-lg font-bold text-gray-900">{subject.totalQuizzes}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Correctas</p>
                        <p className="text-lg font-bold text-green-700">{correctAnswers}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Unidad Actual</p>
                        <p className="text-lg font-bold text-blue-700">{subject.currentUnit}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Aprobadas</p>
                        <p className="text-lg font-bold text-purple-700">{subject.completedUnits}</p>
                      </div>
                    </div>

                    {/* Barra de progreso */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${subject.averagePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Consejos y Recomendaciones */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Recomendaciones Personalizadas</h2>
          <div className="space-y-3">
            {stats.averageScore >= 80 ? (
              <p className="text-gray-700">
                ✨ ¡Excelente trabajo! Tu rendimiento es sobresaliente. Continúa con este ritmo y considera explorar contenido avanzado.
              </p>
            ) : stats.averageScore >= 60 ? (
              <p className="text-gray-700">
                📚 Buen progreso. Para mejorar, te recomendamos revisar las unidades con menor puntuación y practicar más ejercicios.
              </p>
            ) : (
              <p className="text-gray-700">
                💪 No te desanimes. El aprendizaje es un proceso. Dedica más tiempo a repasar los conceptos fundamentales y no dudes en consultar a tus tutores.
              </p>
            )}
            <p className="text-gray-700">
              🎯 Has completado {stats.completedUnits} unidades. {stats.completedUnits < 3 ? 'Completa más unidades para obtener una visión más completa de tu progreso.' : '¡Sigue así!'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
