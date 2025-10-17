import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, X, CheckCircle, AlertTriangle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000'; 

// Componente para mostrar mensajes de estado (éxito o error)
const MessageModal = ({ message, type, onClose }) => {
  if (!message) return null;

  const color = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const Icon = type === 'success' ? CheckCircle : AlertTriangle;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-sm ${color} text-white rounded-lg shadow-2xl p-6 relative`}>
        <button onClick={onClose} className="absolute top-3 right-3 text-white hover:text-gray-200">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-start">
          <Icon className="w-8 h-8 mr-3 mt-1" />
          <div>
            <h2 className="text-xl font-bold mb-2">
              {type === 'success' ? 'Éxito' : 'Error'}
            </h2>
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function LoginForm() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dni: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { text, type }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validación de campos generales
    if (!formData.email) newErrors.email = 'Email es requerido';
    if (!formData.password) newErrors.password = 'Contraseña es requerida';

    // Validación específica para el registro
    if (!isLogin && !formData.name) newErrors.name = 'Nombre y Apellido es requerido';
    if (!isLogin && !formData.dni) newErrors.dni = 'DNI es requerido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Limpiar mensaje anterior
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    const endpoint = isLogin ? '/api/login' : '/api/register';
    const payload = isLogin 
      ? { email: formData.email, password: formData.password } // Login solo requiere email y password
      : { name: formData.name, email: formData.email, password: formData.password, dni: formData.dni }; // Registro requiere nombre, DNI

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        // Lógica de éxito
        const successMessage = isLogin 
          ? '¡Bienvenido/a! Login exitoso.'
          : 'Registro exitoso. ¡Ahora puedes iniciar sesión!';
        
        setMessage({ text: successMessage, type: 'success' });
        
        // Si es registro, cambiamos a la vista de login automáticamente
        if (!isLogin) {
          setIsLogin(true);
          setFormData({ name: '', email: '', password: '', dni: '' });
        } else {
          // Login exitoso, guardar token y obtener datos del usuario
          if (data.token) {
            localStorage.setItem('token', data.token);
            
            // Obtener datos del usuario con el token
            try {
              const userResponse = await fetch(`${API_BASE_URL}/api/me`, {
                headers: {
                  'Authorization': `Bearer ${data.token}`
                }
              });
              
              if (userResponse.ok) {
                const userData = await userResponse.json();
                localStorage.setItem('user', JSON.stringify(userData));
              }
            } catch (error) {
              console.error('Error al obtener datos del usuario:', error);
            }
          }
          
          // Navegar al dashboard
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        }

      } else {
        // Lógica de error (ej: contraseña incorrecta, usuario no encontrado, email ya registrado)
        const errorMessage = data.message || 'Ocurrió un error desconocido en la autenticación.';
        setMessage({ text: errorMessage, type: 'error' });
      }

    } catch (error) {
      console.error('Error de red/servidor:', error);
      setMessage({ text: 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  // Función para alternar entre Login y Registro
  const toggleMode = () => {
    setIsLogin(prev => !prev);
    setFormData({ name: '', email: '', password: '', dni: '' }); // Limpiar campos
    setErrors({}); // Limpiar errores
    setMessage(null); // Limpiar mensajes
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4 font-inter">
      {/* Modal de Mensajes */}
      <MessageModal 
        message={message?.text} 
        type={message?.type} 
        onClose={() => setMessage(null)} 
      />
      
      <div className="form_container w-full max-w-md bg-white rounded-xl shadow-[0px_106px_42px_rgba(0,0,0,0.01),0px_59px_36px_rgba(0,0,0,0.05),0px_26px_26px_rgba(0,0,0,0.09),0px_7px_15px_rgba(0,0,0,0.1)] p-10">
        
        {/* Logo Banner */}
        <div className="mb-6 flex justify-center">
          {/* Usamos un placeholder si la URL del usuario falla */}
          <img 
            src="https://raw.githubusercontent.com/flancitoo01arg/fonts/e32a7f1cbefe0d578a44393bce23c267bf872f4f/ddws.png" 
            alt="Logo" 
            className="w-full max-w-xs h-auto"
            onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = "https://placehold.co/300x100/2e7d32/ffffff?text=Instituto+Logo";
            }}
          />
        </div>

        {/* Título */}
        <div className="title_container text-center mb-6">
          <h1 className="title text-2xl font-bold text-[#2e7d32] mb-2">
            {isLogin ? 'Ingreso de Alumnos/Tutores' : 'Registro de Nuevo Usuario'}
          </h1>
          <p className="subtitle text-sm text-gray-600 max-w-xs mx-auto">
            {isLogin 
              ? 'Ingrese sus credenciales para acceder a su cuenta' 
              : 'Complete sus datos para crear una nueva cuenta'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Campo Nombre y Apellido (Solo en Registro) */}
          {!isLogin && (
            <div className="input_container">
              <label className="input_label text-xs font-semibold text-gray-600 mb-1 block">
                Nombre y Apellido
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ingrese su nombre completo"
                  className={`input_field w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition-all ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } focus:border-[#2e7d32] focus:ring-2 focus:ring-[#c8e6c9]`}
                  disabled={loading}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
          )}

          {/* Campo DNI (Solo en Registro) */}
          {!isLogin && (
            <div className="input_container">
              <label className="input_label text-xs font-semibold text-gray-600 mb-1 block">
                DNI
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleInputChange}
                  placeholder="Ingrese su DNI"
                  className={`input_field w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition-all ${
                    errors.dni ? 'border-red-500' : 'border-gray-300'
                  } focus:border-[#2e7d32] focus:ring-2 focus:ring-[#c8e6c9]`}
                  disabled={loading}
                />
              </div>
              {errors.dni && <p className="text-red-500 text-xs mt-1">{errors.dni}</p>}
            </div>
          )}

          {/* Campo Email */}
          <div className="input_container">
            <label className="input_label text-xs font-semibold text-gray-600 mb-1 block">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="nombre@correo.com"
                className={`input_field w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition-all ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:border-[#2e7d32] focus:ring-2 focus:ring-[#c8e6c9]`}
                disabled={loading}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Campo Contraseña */}
          <div className="input_container">
            <label className="input_label text-xs font-semibold text-gray-600 mb-1 block">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={`input_field w-full pl-10 pr-10 py-3 border rounded-lg outline-none transition-all ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } focus:border-[#2e7d32] focus:ring-2 focus:ring-[#c8e6c9]`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Botón de Envío */}
          <button
            type="submit"
            className={`sign-in_btn w-full py-3 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center 
              ${loading ? 'bg-[#c8e6c9] cursor-not-allowed' : 'bg-[#2e7d32] hover:bg-[#2e7d32]/90'}`}
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              isLogin ? 'Ingresar' : 'Registrarse'
            )}
          </button>
        </form>

        {/* Enlace para cambiar entre Login y Registro */}
        <p className="note text-center mt-6">
          <button
            type="button"
            onClick={toggleMode}
            className="text-[#2e7d32] hover:underline text-sm font-medium"
            disabled={loading}
          >
            {isLogin 
              ? '¿Es tu primera vez? Regístrate aquí' 
              : '¿Ya tienes cuenta? Inicia sesión aquí'}
          </button>
        </p>

        <p className="text-center text-xs text-gray-500 mt-4">
          Términos de uso y Condiciones
        </p>
      </div>
    </div>
  );
}
