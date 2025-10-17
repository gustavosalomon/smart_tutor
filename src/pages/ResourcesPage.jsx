import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, ExternalLink, Download } from 'lucide-react';

export default function ResourcesPage() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Próximas sesiones de clases virtuales
  const upcomingSessions = [
    {
      id: 1,
      subject: 'Matemáticas',
      topic: 'Ecuaciones Diferenciales',
      teacher: 'Profe. Dellagnolo Johanna',
      date: '2025-10-20',
      time: '15:00',
      duration: '60 min',
      classroomLink: 'https://classroom.google.com/c/example1',
      meetLink: 'https://meet.google.com/xyz-abcd-efg',
      icon: '📐',
      color: 'blue'
    },
    {
      id: 2,
      subject: 'Física',
      topic: 'Óptica y Refracción',
      teacher: 'Prof. Cáceres Lara',
      date: '2025-10-22',
      time: '16:30',
      duration: '90 min',
      classroomLink: 'https://classroom.google.com/c/example2',
      meetLink: 'https://meet.google.com/abc-defg-hij',
      icon: '⚛️',
      color: 'purple'
    },
    {
      id: 3,
      subject: 'Matemáticas',
      topic: 'Integración por Partes',
      teacher: 'Profe. Dellagnolo Johanna',
      date: '2025-10-25',
      time: '14:00',
      duration: '60 min',
      classroomLink: 'https://classroom.google.com/c/example1',
      meetLink: 'https://meet.google.com/klm-nopq-rst',
      icon: '📐',
      color: 'blue'
    }
  ];

  const mathematicsResources = [
    {
      name: 'GeoGebra',
      description: 'Herramienta interactiva para geometría, álgebra, cálculo y más',
      icon: '📐',
      url: 'https://www.geogebra.org/',
      category: 'Software de Matemáticas',
      type: 'Web & Desktop'
    },
    {
      name: 'Desmos',
      description: 'Calculadora gráfica online avanzada y gratuita',
      icon: '📊',
      url: 'https://www.desmos.com/calculator',
      category: 'Calculadora Gráfica',
      type: 'Web'
    },
    {
      name: 'Wolfram Alpha',
      description: 'Motor computacional para resolver problemas matemáticos complejos',
      icon: '🧮',
      url: 'https://www.wolframalpha.com/',
      category: 'Calculadora Avanzada',
      type: 'Web'
    },
    {
      name: 'Symbolab',
      description: 'Solucionador de ecuaciones paso a paso con explicaciones',
      icon: '✏️',
      url: 'https://www.symbolab.com/',
      category: 'Solver',
      type: 'Web'
    },
    {
      name: 'Microsoft Math Solver',
      description: 'Resuelve problemas matemáticos con pasos detallados',
      icon: '🔢',
      url: 'https://mathsolver.microsoft.com/',
      category: 'Solver',
      type: 'Web & App'
    },
    {
      name: 'Khan Academy',
      description: 'Plataforma educativa con ejercicios interactivos de matemáticas',
      icon: '🎓',
      url: 'https://es.khanacademy.org/math',
      category: 'Aprendizaje',
      type: 'Web'
    }
  ];

  const physicsResources = [
    {
      name: 'PhET Simulations',
      description: 'Simulaciones interactivas de física de la Universidad de Colorado',
      icon: '⚛️',
      url: 'https://phet.colorado.edu/es/',
      category: 'Simulaciones',
      type: 'Web'
    },
    {
      name: 'Algodoo',
      description: 'Simulador de física 2D para crear y experimentar',
      icon: '🎮',
      url: 'http://www.algodoo.com/',
      category: 'Simulador',
      type: 'Desktop'
    },
    {
      name: 'Tracker Video Analysis',
      description: 'Análisis de movimiento y modelado en videos',
      icon: '📹',
      url: 'https://physlets.org/tracker/',
      category: 'Análisis',
      type: 'Desktop'
    },
    {
      name: 'Physics Classroom',
      description: 'Recursos educativos y tutoriales de física',
      icon: '📚',
      url: 'https://www.physicsclassroom.com/',
      category: 'Aprendizaje',
      type: 'Web'
    },
    {
      name: 'Fluid Pressure Calculator',
      description: 'Calculadora online para problemas de presión y fluidos',
      icon: '💧',
      url: 'https://www.omnicalculator.com/physics',
      category: 'Calculadora',
      type: 'Web'
    },
    {
      name: 'HyperPhysics',
      description: 'Mapa conceptual interactivo de conceptos de física',
      icon: '🔬',
      url: 'http://hyperphysics.phy-astr.gsu.edu/hbase/index.html',
      category: 'Referencia',
      type: 'Web'
    }
  ];

  const SessionCard = ({ session }) => {
    const sessionDate = new Date(session.date);
    const today = new Date();
    const daysUntil = Math.ceil((sessionDate - today) / (1000 * 60 * 60 * 24));
    
    const isToday = daysUntil === 0;
    const isTomorrow = daysUntil === 1;
    const isPast = daysUntil < 0;

    const colorClasses = {
      blue: 'from-blue-50 to-blue-100 border-blue-300',
      purple: 'from-purple-50 to-purple-100 border-purple-300',
      green: 'from-green-50 to-green-100 border-green-300'
    };

    return (
      <div className={`bg-gradient-to-br ${colorClasses[session.color]} border-2 rounded-xl p-6 relative ${isPast ? 'opacity-50' : ''}`}>
        {/* Badge de urgencia */}
        {isToday && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
            ¡HOY!
          </div>
        )}
        {isTomorrow && (
          <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Mañana
          </div>
        )}
        
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center text-3xl shadow-sm">
            {session.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg mb-1">{session.topic}</h3>
            <p className="text-sm text-gray-700 font-medium">{session.subject}</p>
            <p className="text-xs text-gray-600 mt-1">👨‍🏫 {session.teacher}</p>
          </div>
        </div>

        {/* Información de fecha y hora */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white bg-opacity-70 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-600">Fecha</p>
            <p className="text-sm font-semibold text-gray-900">
              {sessionDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
            </p>
          </div>
          <div className="bg-white bg-opacity-70 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-600">Hora</p>
            <p className="text-sm font-semibold text-gray-900">{session.time}</p>
          </div>
          <div className="bg-white bg-opacity-70 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-600">Duración</p>
            <p className="text-sm font-semibold text-gray-900">{session.duration}</p>
          </div>
        </div>

        {/* Botones de acceso */}
        <div className="flex gap-2">
          <a
            href={session.classroomLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-white hover:bg-gray-50 text-gray-900 font-medium py-2 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors border border-gray-300"
          >
            <span>📚</span>
            Classroom
          </a>
          <a
            href={session.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <span>📹</span>
            Unirse
          </a>
        </div>

        {isPast && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-20 rounded-xl">
            <span className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold">Sesión finalizada</span>
          </div>
        )}
      </div>
    );
  };

  const ResourceCard = ({ resource }) => (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-xl border-2 border-gray-200 hover:border-green-500 p-6 transition-all duration-300 hover:shadow-lg group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
          {resource.icon}
        </div>
        <ExternalLink className="text-gray-400 group-hover:text-green-600 transition-colors" size={20} />
      </div>
      
      <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-green-700 transition-colors">
        {resource.name}
      </h3>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {resource.description}
      </p>
      
      <div className="flex gap-2 flex-wrap">
        <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
          {resource.category}
        </span>
        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
          {resource.type}
        </span>
      </div>
    </a>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <img src="/logodash.png" alt="Smart Tutor Logo" className="h-10 w-auto"/>
          <nav className="flex gap-6 text-sm text-gray-700">
            <button className="hover:text-green-700 cursor-pointer bg-transparent border-none" onClick={() => navigate('/dashboard')}>Inicio</button>
            <button className="hover:text-green-700 bg-transparent border-none cursor-pointer">Tutores</button>
            <button className="text-green-700 font-semibold bg-transparent border-none cursor-pointer">Recursos</button>
            <button className="hover:text-green-700 cursor-pointer bg-transparent border-none" onClick={() => navigate('/my-progress')}>Mi Progreso</button>
            <button className="hover:text-green-700 cursor-pointer bg-transparent border-none" onClick={() => navigate('/settings')}>Configuración</button>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📚 Recursos de Aprendizaje</h1>
          <p className="text-gray-600">Software y herramientas recomendadas para potenciar tu estudio</p>
        </div>

        {/* Próximas Clases Virtuales */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📹</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Próximas Clases Virtuales</h2>
                <p className="text-sm text-gray-600">Conecta con tus profesores en Google Classroom</p>
              </div>
            </div>
            <a 
              href="https://classroom.google.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-green-700 hover:text-green-800 font-medium flex items-center gap-1"
            >
              Ver todas las clases
              <ExternalLink size={14} />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </section>

        {/* Banner informativo */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Download className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">💡 Tip: Instala las herramientas que más uses</h3>
              <p className="text-sm text-gray-700">
                Muchas de estas aplicaciones ofrecen versiones de escritorio que puedes usar sin conexión a internet. 
                Haz clic en cada tarjeta para visitar el sitio oficial y descargar la versión que necesites.
              </p>
            </div>
          </div>
        </div>

        {/* Sección Matemáticas */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📐</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Software de Matemáticas</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mathematicsResources.map((resource, index) => (
              <ResourceCard key={index} resource={resource} />
            ))}
          </div>
        </section>

        {/* Sección Física */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚛️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Software de Física</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {physicsResources.map((resource, index) => (
              <ResourceCard key={index} resource={resource} />
            ))}
          </div>
        </section>

        {/* Sección adicional - Más recursos */}
        <div className="mt-12 bg-white rounded-xl border-2 border-gray-200 p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">¿Conoces más recursos que puedan servirte?</h3>
          <p className="text-gray-600 mb-4">
            Estamos siempre buscando agregar nuevas herramientas que puedan ayudar a nuestros estudiantes.
          </p>
          <button className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
            Sugerir un recurso
          </button>
        </div>
      </main>
    </div>
  );
}
