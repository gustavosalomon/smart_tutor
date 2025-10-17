import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, User, Settings, ArrowLeft, 
  UserCircle, Lock, Bell, Globe, 
  Shield, Smartphone,
  Eye, EyeOff, Save, Trash2
} from 'lucide-react';

export default function SettingsPage() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('perfil');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-xl font-semibold text-green-700">Smart Tutor</div>
          <nav className="flex gap-6 text-sm text-gray-700">
            <button className="hover:text-green-700 cursor-pointer bg-transparent border-none" onClick={() => navigate('/dashboard')}>Inicio</button>
            <button className="hover:text-green-700 bg-transparent border-none cursor-pointer">Tutores</button>
            <button className="hover:text-green-700 bg-transparent border-none cursor-pointer">Recursos</button>
            <button className="hover:text-green-700 cursor-pointer bg-transparent border-none" onClick={() => navigate('/my-progress')}>Mi Progreso</button>
            <button className="text-green-700 font-semibold cursor-pointer bg-transparent border-none">Configuración</button>
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
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Volver al inicio</span>
        </button>

        <h1 className="text-2xl font-semibold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-1">Administra tu cuenta y preferencias</p>

        <div className="flex gap-6 mt-8">
          {/* Menú lateral */}
          <div className="w-64 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 h-fit">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('perfil')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'perfil' 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <UserCircle size={20} />
                Perfil
              </button>
              <button
                onClick={() => setActiveTab('seguridad')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'seguridad' 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Lock size={20} />
                Seguridad
              </button>
              <button
                onClick={() => setActiveTab('notificaciones')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'notificaciones' 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Bell size={20} />
                Notificaciones
              </button>
              <button
                onClick={() => setActiveTab('privacidad')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'privacidad' 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Shield size={20} />
                Privacidad
              </button>
              <button
                onClick={() => setActiveTab('idioma')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'idioma' 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Globe size={20} />
                Idioma y Región
              </button>
            </nav>
          </div>

          {/* Contenido principal */}
          <div className="flex-1">
            {/* Perfil */}
            {activeTab === 'perfil' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Información del Perfil</h2>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                    <img alt="avatar" src="/buho_usuario.png" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <label htmlFor="fileInput" className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition-colors cursor-pointer inline-block">
                      Cambiar Foto
                    </label>
                    <input 
                      id="fileInput" 
                      type="file" 
                      accept="image/jpeg,image/png,image/gif" 
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-2">JPG, PNG o GIF. Máximo 5MB</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                    <input 
                      type="text" 
                      defaultValue="Juan Pérez" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">DNI</label>
                    <input 
                      type="text" 
                      defaultValue="12345678" 
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      defaultValue="juan.perez@ejemplo.com" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                    <input 
                      type="tel" 
                      defaultValue="+54 11 1234-5678" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button className="px-6 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors flex items-center gap-2">
                      <Save size={18} />
                      Guardar Cambios
                    </button>
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Seguridad */}
            {activeTab === 'seguridad' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Seguridad</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Cambiar Contraseña</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña actual</label>
                        <div className="relative">
                          <input 
                            type={showPassword ? "text" : "password"}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none pr-10"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nueva contraseña</label>
                        <div className="relative">
                          <input 
                            type={showNewPassword ? "text" : "password"}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none pr-10"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar nueva contraseña</label>
                        <input 
                          type="password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                        />
                      </div>

                      <button className="px-6 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors">
                        Actualizar Contraseña
                      </button>
                    </div>
                  </div>

                  <hr />

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Autenticación de dos factores</h3>
                    <p className="text-sm text-gray-600 mb-4">Agrega una capa extra de seguridad a tu cuenta</p>
                    <button className="px-6 py-3 border border-green-700 text-green-700 rounded-lg font-medium hover:bg-green-50 transition-colors">
                      Activar 2FA
                    </button>
                  </div>

                  <hr />

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Sesiones activas</h3>
                    <p className="text-sm text-gray-600 mb-4">Revisa dónde has iniciado sesión</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Smartphone size={20} className="text-gray-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Windows • Chrome</p>
                            <p className="text-xs text-gray-500">Buenos Aires, Argentina • Ahora</p>
                          </div>
                        </div>
                        <span className="text-xs text-green-600 font-medium">Activa</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notificaciones */}
            {activeTab === 'notificaciones' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notificaciones</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Notificaciones por email</h3>
                      <p className="text-sm text-gray-500">Recibe actualizaciones importantes por correo</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Nuevas tareas y materiales</h3>
                      <p className="text-sm text-gray-500">Cuando tus tutores publiquen nuevo contenido</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Recordatorios de sesiones</h3>
                      <p className="text-sm text-gray-500">15 minutos antes de cada sesión programada</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Mensajes de tutores</h3>
                      <p className="text-sm text-gray-500">Cuando recibas un nuevo mensaje</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Boletín semanal</h3>
                      <p className="text-sm text-gray-500">Resumen de tu progreso y actividades</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Privacidad */}
            {activeTab === 'privacidad' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacidad</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Perfil público</h3>
                      <p className="text-sm text-gray-500">Permite que otros estudiantes vean tu perfil</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Mostrar progreso</h3>
                      <p className="text-sm text-gray-500">Comparte tus logros con otros estudiantes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <hr />

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Gestión de Datos</h3>
                    <div className="space-y-3">
                      <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-left">
                        Descargar mis datos
                      </button>
                      <button className="w-full px-4 py-3 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors text-left flex items-center gap-2">
                        <Trash2 size={18} />
                        Eliminar cuenta permanentemente
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Idioma */}
            {activeTab === 'idioma' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Idioma y Región</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Idioma de la interfaz</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none">
                      <option>Español</option>
                      <option>English</option>
                      <option>Português</option>
                      <option>Français</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Zona horaria</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none">
                      <option>GMT-3 (Buenos Aires)</option>
                      <option>GMT-5 (Nueva York)</option>
                      <option>GMT+0 (Londres)</option>
                      <option>GMT+1 (Madrid)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Formato de fecha</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none">
                      <option>DD/MM/AAAA</option>
                      <option>MM/DD/AAAA</option>
                      <option>AAAA-MM-DD</option>
                    </select>
                  </div>

                  <button className="px-6 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors">
                    Guardar Preferencias
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
