import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, Users, TrendingUp, BookOpen, ExternalLink, Bell, CheckCircle, AlertCircle, Clock, Award, Menu, X } from 'lucide-react';
import { getCurrentUser } from '../services/api';
import SubjectsPage from './Subjects';
import DailyPerformanceChart from '../components/DailyPerformanceChart';

export default function Dashboard() {
  // Referencia para scroll
  const profesoresRef = React.useRef(null);

  const handleScrollToProfesores = () => {
    profesoresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Notificaciones de ejemplo
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      icon: CheckCircle,
      title: '¡Unidad completada!',
      message: 'Completaste la Unidad 1 de Física con 100% de aciertos',
      time: 'Hace 2 horas',
      read: false,
      color: 'green'
    },
    {
      id: 2,
      type: 'info',
      icon: Clock,
      title: 'Clase próxima',
      message: 'Ecuaciones Diferenciales comienza en 1 hora',
      time: 'Hace 3 horas',
      read: false,
      color: 'blue'
    },
    {
      id: 3,
      type: 'achievement',
      icon: Award,
      title: '¡Nueva insignia!',
      message: 'Desbloqueaste: "Maestro de las Matemáticas"',
      time: 'Hace 1 día',
      read: false,
      color: 'yellow'
    },
    {
      id: 4,
      type: 'warning',
      icon: AlertCircle,
      title: 'Recordatorio',
      message: 'Tienes 3 ejercicios pendientes de Física',
      time: 'Hace 2 días',
      read: true,
      color: 'orange'
    },
    {
      id: 5,
      type: 'info',
      icon: BookOpen,
      title: 'Nuevo contenido',
      message: 'Se agregó material de estudio para Unidad 3',
      time: 'Hace 3 días',
      read: true,
      color: 'purple'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser(token).then(data => {
        if (data && !data.message) setUser(data);
      });
    }
  }, []);

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
      if (showUserMenu && !event.target.closest('.user-menu-dropdown')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications, showUserMenu]);

  // Prevenir scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);

  const handleLogout = () => {
    localStorage.removeItem('token');
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

  return (
    <div className="min-h-screen bg-gradient-subtle bg-mesh-pattern">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-soft">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <img 
              src="/logodash.png" 
              alt="Smart Tutor Logo" 
              className="h-10 w-auto" 
            />
          
          {/* Navegación Desktop - Oculta en móviles */}
          <nav className="hidden md:flex gap-6 text-sm text-secondary-700">
            <button className="hover:text-primary-700 cursor-pointer bg-transparent border-none font-medium transition-colors" onClick={() => navigate('/dashboard')}>Inicio</button>
            <button className="hover:text-primary-700 cursor-pointer bg-transparent border-none transition-colors" onClick={handleScrollToProfesores}>Tutores</button>
            <button className="hover:text-primary-700 bg-transparent border-none cursor-pointer transition-colors" onClick={() => navigate('/resources')}>Recursos</button>
            <button className="hover:text-primary-700 cursor-pointer bg-transparent border-none transition-colors" onClick={() => navigate('/my-progress')}>Mi Progreso</button>
            <button className="hover:text-primary-700 cursor-pointer bg-transparent border-none transition-colors" onClick={() => navigate('/settings')}>Configuración</button>
          </nav>
          
          <div className="flex items-center gap-2 md:gap-4">
            {/* Botón Hamburguesa - Solo visible en móviles */}
            <button
              onClick={() => setShowMobileMenu(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Menú"
            >
              <Menu size={24} className="text-gray-600" />
            </button>

            {/* Botón de Notificaciones */}
            <div className="relative notification-dropdown">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Notificaciones"
              >
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
                <Bell size={20} className="text-gray-600" />
              </button>

              {/* Dropdown de Notificaciones */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[500px] overflow-hidden animate-scale-in">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-primary-50 to-white">
                    <h3 className="font-semibold text-secondary-900 tracking-tight">Notificaciones</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-xs text-primary-700 hover:text-primary-800 font-medium"
                      >
                        Marcar todas como leídas
                      </button>
                    )}
                  </div>

                  {/* Lista de Notificaciones */}
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500">
                        <Bell size={48} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No tienes notificaciones</p>
                      </div>
                    ) : (
                      notifications.map((notification) => {
                        const IconComponent = notification.icon;
                        const colorClasses = {
                          green: 'bg-green-100 text-green-600',
                          blue: 'bg-blue-100 text-blue-600',
                          yellow: 'bg-yellow-100 text-yellow-600',
                          orange: 'bg-orange-100 text-orange-600',
                          purple: 'bg-purple-100 text-purple-600'
                        };

                        return (
                          <div
                            key={notification.id}
                            onClick={() => markAsRead(notification.id)}
                            className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                              !notification.read ? 'bg-primary-50/30' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${colorClasses[notification.color]} flex-shrink-0`}>
                                <IconComponent size={20} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className={`text-sm font-semibold text-secondary-900 ${!notification.read ? 'font-bold' : ''}`}>
                                    {notification.title}
                                  </h4>
                                  {!notification.read && (
                                    <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1"></span>
                                  )}
                                </div>
                                <p className="text-xs text-secondary-600 mt-1">
                                  {notification.message}
                                </p>
                                <span className="text-xs text-secondary-400 mt-1 block">
                                  {notification.time}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="w-full text-center text-sm text-primary-700 hover:text-primary-800 font-medium"
                    >
                      Ver todas las notificaciones
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative user-menu-dropdown">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 focus:ring-2 focus:ring-green-500"
              >
                <img alt="avatar" src="/buho_usuario.png" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-scale-in">
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

      {/* Menú Móvil Lateral */}
      {showMobileMenu && (
        <>
          {/* Overlay oscuro */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden animate-fade-in"
            onClick={() => setShowMobileMenu(false)}
          />
          
          {/* Panel lateral */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden animate-slide-in-right">
            <div className="flex flex-col h-full">
              {/* Header del menú */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    <img alt="avatar" src="/buho_usuario.png" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 tracking-tight">
                      {user?.name || user?.email || 'Usuario'}
                    </h3>
                    <p className="text-xs text-secondary-600">Estudiante</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Cerrar menú"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Navegación */}
              <nav className="flex-1 overflow-y-auto py-4">
                <div className="space-y-1 px-2">
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-secondary-900 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <TrendingUp size={20} className="text-primary-600" />
                    Inicio
                  </button>
                  
                  <button
                    onClick={() => {
                      handleScrollToProfesores();
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-secondary-700 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Users size={20} className="text-primary-600" />
                    Tutores
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate('/resources');
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-secondary-700 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <BookOpen size={20} className="text-primary-600" />
                    Recursos
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate('/my-progress');
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-secondary-700 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <TrendingUp size={20} className="text-primary-600" />
                    Mi Progreso
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-secondary-700 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Settings size={20} className="text-primary-600" />
                    Configuración
                  </button>

                  <div className="my-4 border-t border-gray-200"></div>

                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-secondary-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <User size={20} className="text-gray-600" />
                    Mi Perfil
                  </button>
                </div>
              </nav>

              {/* Footer del menú */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">
          ¡Bienvenido de nuevo{user && user.name ? `, ${user.name}` : user && user.email ? `, ${user.email}` : ''}!
        </h1>
        <p className="text-secondary-600 mt-1">Continúa tu camino de aprendizaje personalizado</p>
        
        {/* Próximas Clases Virtuales */}
        <section className="mt-8 mb-10 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📹</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-secondary-900 tracking-tight">Próximas Clases Virtuales</h2>
                <p className="text-sm text-secondary-600">Conecta con tus profesores en Google Classroom</p>
              </div>
            </div>
            <a 
              href="https://classroom.google.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary-700 hover:text-primary-800 font-medium flex items-center gap-1 transition-colors"
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

        <div className="mt-8">
          <SubjectsPage />
        </div>


        {/* Sección: Beneficios */}
        <div className="mt-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-soft p-6 border border-primary-100">
            <div className="flex flex-col md:flex-row justify-between items-stretch gap-8">
              {/* Profesores */}
              <div 
                className="flex-1 flex flex-col items-center text-center cursor-pointer hover:bg-primary-50 transition-colors rounded-2xl p-4"
                onClick={handleScrollToProfesores}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-3">
                  <Users className="text-primary-700" size={32} />
                </div>
                <h3 className="font-semibold text-secondary-900 mb-1">Profesores</h3>
                <p className="text-sm text-secondary-600">Aprende con profesionales calificados y con experiencia</p>
              </div>
              {/* Seguimiento Personalizado */}
              <div 
                className="flex-1 flex flex-col items-center text-center cursor-pointer hover:bg-primary-50 transition-colors rounded-2xl p-4"
                onClick={() => navigate('/tracking')}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-3">
                  <TrendingUp className="text-primary-700" size={32} />
                </div>
                <h3 className="font-semibold text-secondary-900 mb-1">Seguimiento Personalizado</h3>
                <p className="text-sm text-secondary-600">Monitorea tu progreso y adapta tu plan de estudios</p>
              </div>
              {/* Recursos Ilimitados */}
              <div 
                className="flex-1 flex flex-col items-center text-center cursor-pointer hover:bg-primary-50 transition-colors rounded-2xl p-4"
                onClick={() => navigate('/resources')}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-3">
                  <BookOpen className="text-primary-700" size={32} />
                </div>
                <h3 className="font-semibold text-secondary-900 mb-1">Recursos ilimitados</h3>
                <p className="text-sm text-secondary-600">Accede a vídeos, ejercicios y material de estudio</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección: Nuestros Tutores Destacados */}
  <div className="mt-12" ref={profesoresRef}>
          <h2 className="text-2xl font-bold mb-1 text-secondary-900 tracking-tight">Nuestros Profes..!!</h2>
          <p className="mb-6 text-secondary-600">Contacta directamente a nuestros mejores profesionales</p>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profe 1 */}
            <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-xl border-2 border-primary-500 p-6 flex flex-col items-center shadow-soft hover:shadow-strong hover:scale-105 transition-all duration-300 cursor-pointer group">
              <img src="/buho_usuario.png" alt="Prof. Cáceres Lara" className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-white shadow-medium group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-semibold text-secondary-900 text-lg group-hover:text-primary-700 transition-colors">Prof. Cáceres Lara</h3>
              <p className="text-sm text-secondary-600 mb-2">Física</p>
              <div className="w-full flex flex-col gap-2 mb-3">
                <div className="flex items-center justify-center bg-secondary-50 rounded px-3 py-2 text-secondary-700 group-hover:bg-primary-50 transition-colors"><span className="mr-2">✉️</span>cacereslara@ipf.com</div>
                <div className="flex items-center justify-center bg-secondary-50 rounded px-3 py-2 text-secondary-700 group-hover:bg-primary-50 transition-colors"><span className="mr-2">📞</span> +54 9 11 2345-6789</div>
              </div>
              <div className="flex gap-2 w-full mt-auto">
                <a href="mailto:ana.garcia@edumentor.com" className="flex-1 py-2 rounded-lg border border-secondary-300 text-secondary-700 flex items-center justify-center gap-2 hover:bg-secondary-100 transition"><span>📧</span>Email</a>
                <a href="https://wa.me/5491123456789" target="_blank" rel="noopener noreferrer" className="flex-1 py-2 rounded-lg border border-primary-600 text-white bg-primary-600 flex items-center justify-center gap-2 hover:bg-primary-700 transition"><span>🟢</span>WhatsApp</a>
              </div>
            </div>
            {/* Profe 2 */}
            <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-xl border-2 border-secondary-200 p-6 flex flex-col items-center shadow-soft hover:shadow-strong hover:scale-105 hover:border-primary-500 transition-all duration-300 cursor-pointer group">
              <img src="/buho_usuario.png" alt="Dellagnolo Johanna" className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-white shadow-medium group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-semibold text-secondary-900 text-lg group-hover:text-primary-700 transition-colors">Profe. Dellagnolo Johanna</h3>
              <p className="text-sm text-secondary-600 mb-2">Matemáticas</p>
              <div className="w-full flex flex-col gap-2 mb-3">
                <div className="flex items-center justify-center bg-secondary-50 rounded px-3 py-2 text-secondary-700 group-hover:bg-primary-50 transition-colors"><span className="mr-2">✉️</span>dellagnolojohanna@ipf.com</div>
                <div className="flex items-center justify-center bg-secondary-50 rounded px-3 py-2 text-secondary-700 group-hover:bg-primary-50 transition-colors"><span className="mr-2">📞</span> +54 9 11 3456-7890</div>
              </div>
              <div className="flex gap-2 w-full mt-auto">
                <a href="mailto:carlos.mendez@edumentor.com" className="flex-1 py-2 rounded-lg border border-secondary-300 text-secondary-700 flex items-center justify-center gap-2 hover:bg-secondary-100 transition"><span>📧</span>Email</a>
                <a href="https://wa.me/5491134567890" target="_blank" rel="noopener noreferrer" className="flex-1 py-2 rounded-lg border border-primary-600 text-white bg-primary-600 flex items-center justify-center gap-2 hover:bg-primary-700 transition"><span>🟢</span>WhatsApp</a>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de Rendimiento Diario */}
        <div className="mt-8">
          <DailyPerformanceChart />
        </div>
      </main>
    </div>
  );
}
