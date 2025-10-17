import React, { useEffect, useState } from 'react';
import { TrendingUp, Loader } from 'lucide-react';
import { getDailyProgress } from '../services/api';

export default function DailyPerformanceChart() {
  const [data, setData] = useState([
    { day: 'Lun 11', matemáticas: 0, física: 0 },
    { day: 'Mar 12', matemáticas: 0, física: 0 },
    { day: 'Mié 13', matemáticas: 0, física: 0 },
    { day: 'Jue 14', matemáticas: 0, física: 0 },
    { day: 'Vie 15', matemáticas: 0, física: 0 },
    { day: 'Sáb 16', matemáticas: 0, física: 0 },
    { day: 'Dom 17', matemáticas: 0, física: 0 }
  ]);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState(['matemáticas', 'física']);

  useEffect(() => {
    const fetchDailyData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          console.warn('Usuario no autenticado');
          setLoading(false);
          return;
        }
        
        const user = JSON.parse(userStr);
        const userId = user._id || user.id;
        
        const dailyData = await getDailyProgress(userId);
        
        // Validar que dailyData es un array
        if (!dailyData || !Array.isArray(dailyData) || dailyData.length === 0) {
          console.log('No hay datos de progreso diario, usando datos por defecto');
          // Mantener datos por defecto (ya están en el estado inicial)
          setLoading(false);
          return;
        }
        
        setData(dailyData);
        
        // Extraer las materias únicas de los datos
        const allSubjects = new Set();
        dailyData.forEach(dayData => {
          Object.keys(dayData).forEach(key => {
            if (key !== 'day') {
              allSubjects.add(key);
            }
          });
        });
        
        if (allSubjects.size > 0) {
          setSubjects(Array.from(allSubjects));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener progreso diario:', error);
        // Mantener datos por defecto en caso de error
        setLoading(false);
      }
    };

    fetchDailyData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center h-64">
          <Loader className="animate-spin text-green-600" size={32} />
          <span className="ml-2 text-gray-600">Cargando progreso diario...</span>
        </div>
      </div>
    );
  }

  // Verificar que data es un array válido
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-gray-700" size={20} />
          <h2 className="text-xl font-semibold text-gray-900">Rendimiento Diario</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>No hay datos de progreso diario disponibles.</p>
          <p className="text-sm mt-2">Completa algunos quizzes para ver tu rendimiento aquí.</p>
        </div>
      </div>
    );
  }

  // Colores para cada materia
  const subjectColors = {
    'matemáticas': '#16a34a',
    'física': '#4ade80',
    'ciencias': '#4ade80',
    'idiomas': '#a3e635'
  };

  // Encontrar el valor máximo para escalar el gráfico
  const maxValue = 100;
  const minValue = 0;

  // Calcular la altura de cada punto en el SVG (invertido porque SVG crece hacia abajo)
  const getY = (value) => {
    const chartHeight = 200;
    const padding = 20;
    return chartHeight - padding - ((value - minValue) / (maxValue - minValue)) * (chartHeight - 2 * padding);
  };

  // Calcular posición X para cada día
  const getX = (index) => {
    const chartWidth = 600;
    const padding = 40;
    return padding + (index * (chartWidth - 2 * padding) / (data.length - 1));
  };

  // Generar puntos de la línea
  const generatePath = (dataKey) => {
    return data.map((item, index) => {
      const x = getX(index);
      const y = getY(item[dataKey] || 0);
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="text-gray-700" size={20} />
        <h2 className="text-xl font-semibold text-gray-900">Rendimiento Diario (Últimos 7 días)</h2>
      </div>
      
      <div className="relative">
        <svg viewBox="0 0 600 240" className="w-full h-64">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((value) => (
            <g key={value}>
              <line
                x1="40"
                y1={getY(value)}
                x2="560"
                y2={getY(value)}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
              <text x="10" y={getY(value) + 5} fontSize="12" fill="#9ca3af">
                {value}
              </text>
            </g>
          ))}

          {/* Líneas y puntos para cada materia */}
          {subjects.map((subject, subjectIndex) => {
            const color = subjectColors[subject] || `hsl(${subjectIndex * 60}, 70%, 50%)`;
            return (
              <g key={subject}>
                {/* Línea */}
                <path
                  d={generatePath(subject)}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                />
                {/* Puntos */}
                {data.map((item, index) => (
                  <circle
                    key={`${subject}-${index}`}
                    cx={getX(index)}
                    cy={getY(item[subject] || 0)}
                    r="4"
                    fill={color}
                    stroke="white"
                    strokeWidth="2"
                  />
                ))}
              </g>
            );
          })}

          {/* Etiquetas del eje X */}
          {data.map((item, index) => (
            <text
              key={`label-${index}`}
              x={getX(index)}
              y="230"
              fontSize="11"
              fill="#6b7280"
              textAnchor="middle"
            >
              {item.day}
            </text>
          ))}
        </svg>

        {/* Leyenda dinámica */}
        <div className="flex justify-center gap-6 mt-4 flex-wrap">
          {subjects.map((subject, index) => (
            <div key={subject} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: subjectColors[subject] || `hsl(${index * 60}, 70%, 50%)` }}
              ></div>
              <span className="text-sm text-gray-600 capitalize">{subject}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
