import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, ArrowLeft, Loader } from 'lucide-react';
import DailyPerformanceChart from '../components/DailyPerformanceChart';
import { getProgressSummary } from '../services/api';
import { getAllLocalProgress } from '../utils/progressStorage';

export default function MyProgress() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [subjectProgress, setSubjectProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overallAverage, setOverallAverage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          console.warn('Usuario no autenticado');
          setLoading(false);
          return;
        }
        
        const user = JSON.parse(userStr);
        const userId = user._id || user.id;
        
        // Intentar cargar desde servidor
        let serverSummary = [];
        try {
          serverSummary = await getProgressSummary(userId);
        } catch (error) {
          console.warn('No se pudo cargar progreso del servidor');
        }
        
        // Cargar progreso local
        const localProgress = getAllLocalProgress(userId);
        
        // Combinar progreso local y del servidor
        const combinedProgress = [];
        const processedSubjects = new Set();
        
        // Procesar progreso del servidor
        if (serverSummary && serverSummary.length > 0) {
          serverSummary.forEach(subject => {
            combinedProgress.push(subject);
            processedSubjects.add(subject.name);
          });
        }
        
        // Agregar progreso local que no esté en el servidor
        Object.keys(localProgress).forEach(subjectId => {
          const localSubject = localProgress[subjectId];
          const subjectName = localSubject.subjectName || 'Materia';
          
          if (!processedSubjects.has(subjectName)) {
            // Calcular estadísticas del progreso local
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
          }
        });
        
        setSubjectProgress(combinedProgress);
        
        // Calcular promedio general
        if (combinedProgress.length > 0) {
          const totalAvg = combinedProgress.reduce((acc, subject) => acc + subject.averagePercentage, 0);
          setOverallAverage(Math.round(totalAvg / combinedProgress.length));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener resumen de progreso:', error);
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/*<div className="text-xl font-semibold text-green-700">Smart Tutor</div>*/}
          <img src="/logodash.png" alt="Smart Tutor Logo" className="h-10 w-auto"/>
          <nav className="flex gap-6 text-sm text-gray-700">
            <button className="hover:text-green-700 cursor-pointer bg-transparent border-none" onClick={() => navigate('/dashboard')}>Inicio</button>
            <button className="hover:text-green-700 bg-transparent border-none cursor-pointer">Tutores</button>
            <button className="hover:text-green-700 bg-transparent border-none cursor-pointer" onClick={() => navigate('/resources')}>Recursos</button>
            <button className="text-green-700 font-semibold cursor-pointer bg-transparent border-none" onClick={() => navigate('/my-progress')}>Mi Progreso</button>
            <button className="hover:text-green-700 bg-transparent border-none cursor-pointer" onClick={() => navigate('/settings')}>Configuración</button>
          </nav>
          <div className="flex items-center gap-4">
            <button className="relative" aria-label="Notificaciones">
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
              <span className="text-gray-600">🔔</span>
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 focus:ring-2 focus:ring-green-500"
              >
                <img alt="avatar" src="/buho_usuario.png" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button 
                    onClick={() => navigate('/settings')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <User size={16} />
                    Mi Perfil
                  </button>
                  <button 
                    onClick={() => navigate('/settings')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Settings size={16} />
                    Configuración
                  </button>
                  <hr className="my-1" />
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Botón de regreso */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Volver al inicio</span>
        </button>

        <h1 className="text-2xl font-semibold text-gray-900">Mi Progreso</h1>
        <p className="text-gray-600 mt-1">Monitorea tu evolución y rendimiento académico</p>

        {/* Seguimiento Diario */}
        <div className="mt-8">
          <DailyPerformanceChart />
        </div>

        {/* Estadísticas adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Promedio General</h3>
            {loading ? (
              <div className="flex items-center">
                <Loader className="animate-spin text-green-600" size={24} />
              </div>
            ) : (
              <>
                <p className="text-3xl font-bold text-green-700">{overallAverage}%</p>
                <p className="text-xs text-gray-500 mt-1">Basado en tus cuestionarios completados</p>
              </>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Preguntas Completadas</h3>
            {loading ? (
              <div className="flex items-center">
                <Loader className="animate-spin text-green-600" size={24} />
              </div>
            ) : (
              <>
                <p className="text-3xl font-bold text-green-700">
                  {subjectProgress.reduce((acc, subject) => acc + subject.totalQuizzes, 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total de intentos</p>
              </>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Materias Activas</h3>
            {loading ? (
              <div className="flex items-center">
                <Loader className="animate-spin text-green-600" size={24} />
              </div>
            ) : (
              <>
                <p className="text-3xl font-bold text-green-700">{subjectProgress.length}</p>
                <p className="text-xs text-gray-500 mt-1">En progreso</p>
              </>
            )}
          </div>
        </div>

        {/* Seguimiento Personalizado Detallado */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">📊 Seguimiento Personalizado</h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="animate-spin text-green-600" size={32} />
              <span className="ml-2 text-gray-600">Cargando progreso...</span>
            </div>
          ) : subjectProgress.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No hay progreso registrado aún.</p>
              <p className="text-sm mt-2">Completa algunas preguntas para ver tu progreso aquí.</p>
            </div>
          ) : (
            <>
              {/* Estadísticas Agregadas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center border border-blue-200">
                  <div className="text-2xl font-bold text-blue-700">
                    {subjectProgress.reduce((acc, s) => acc + s.totalQuizzes, 0)}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">Total Cuestionarios</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center border border-green-200">
                  <div className="text-2xl font-bold text-green-700">
                    {subjectProgress.reduce((acc, s) => acc + s.totalCorrectAnswers, 0)}
                  </div>
                  <div className="text-xs text-green-600 mt-1">Respuestas Correctas</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center border border-purple-200">
                  <div className="text-2xl font-bold text-purple-700">
                    {subjectProgress.reduce((acc, s) => acc + s.completedUnits, 0)}
                  </div>
                  <div className="text-xs text-purple-600 mt-1">Unidades Completadas</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 text-center border border-orange-200">
                  <div className="text-2xl font-bold text-orange-700">{overallAverage}%</div>
                  <div className="text-xs text-orange-600 mt-1">Promedio General</div>
                </div>
              </div>

              {/* Progreso Detallado por Materia */}
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalle por Materia</h3>
              <div className="space-y-6">
                {subjectProgress.map((subject, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">{subject.name === 'Matemáticas' ? '📐' : '⚛️'}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            {subject.name}
                            {subject.isLocal && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                📱 Local
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-gray-500">
                            Última actualización: {new Date(subject.lastAccessed).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-700">{subject.averagePercentage}%</div>
                        <div className="text-xs text-gray-500">Aciertos</div>
                      </div>
                    </div>

                    {/* Barra de Progreso */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progreso de Aciertos</span>
                        <span>{subject.totalCorrectAnswers} / {subject.totalQuestions} respuestas</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2" 
                          style={{ width: `${subject.averagePercentage}%` }}
                        >
                          {subject.averagePercentage > 15 && (
                            <span className="text-white text-[10px] font-bold">{subject.averagePercentage}%</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Estadísticas en Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white rounded p-3 text-center border">
                        <div className="text-lg font-semibold text-gray-900">{subject.totalQuizzes}</div>
                        <div className="text-xs text-gray-500">Intentos</div>
                      </div>
                      <div className="bg-white rounded p-3 text-center border">
                        <div className="text-lg font-semibold text-green-700">{subject.completedUnits}</div>
                        <div className="text-xs text-gray-500">Unidades Completadas</div>
                      </div>
                      <div className="bg-white rounded p-3 text-center border">
                        <div className="text-lg font-semibold text-blue-700">{subject.currentUnit}</div>
                        <div className="text-xs text-gray-500">Unidad Actual</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
