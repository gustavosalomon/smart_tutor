// Utilidades para manejar el progreso local
const PROGRESS_KEY = 'smart_tutor_progress';

/**
 * Guarda el progreso completo en localStorage
 * @param {string} userId - ID del usuario
 * @param {string} subjectId - ID de la materia
 * @param {Object} progressData - Datos de progreso
 */
export const saveLocalProgress = (userId, subjectId, progressData) => {
  try {
    // Obtener todo el progreso guardado
    const allProgress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    
    // Crear estructura si no existe
    if (!allProgress[userId]) {
      allProgress[userId] = {};
    }
    
    // Guardar/actualizar progreso de esta materia
    allProgress[userId][subjectId] = {
      ...progressData,
      lastUpdated: new Date().toISOString()
    };
    
    // Guardar de vuelta en localStorage
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
    
    console.log('✅ Progreso guardado localmente:', { userId, subjectId });
    return true;
  } catch (error) {
    console.error('❌ Error guardando progreso local:', error);
    return false;
  }
};

/**
 * Obtiene el progreso local de una materia específica
 * @param {string} userId - ID del usuario
 * @param {string} subjectId - ID de la materia
 * @returns {Object|null} Datos de progreso o null
 */
export const getLocalProgress = (userId, subjectId) => {
  try {
    const allProgress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    
    if (allProgress[userId] && allProgress[userId][subjectId]) {
      console.log('📚 Progreso local cargado:', { userId, subjectId });
      return allProgress[userId][subjectId];
    }
    
    console.log('ℹ️ No hay progreso local para esta materia');
    return null;
  } catch (error) {
    console.error('❌ Error cargando progreso local:', error);
    return null;
  }
};

/**
 * Obtiene todo el progreso local de un usuario
 * @param {string} userId - ID del usuario
 * @returns {Object} Objeto con todos los progresos del usuario
 */
export const getAllLocalProgress = (userId) => {
  try {
    const allProgress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    return allProgress[userId] || {};
  } catch (error) {
    console.error('❌ Error obteniendo todo el progreso:', error);
    return {};
  }
};

/**
 * Actualiza el contador de respuestas correctas
 * @param {string} userId - ID del usuario
 * @param {string} subjectId - ID de la materia
 * @param {string} subjectName - Nombre de la materia
 * @param {number} unitId - ID de la unidad
 * @param {number} correctCount - Número de respuestas correctas
 */
export const updateCorrectAnswersCount = (userId, subjectId, subjectName, unitId, correctCount) => {
  try {
    const allProgress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    
    if (!allProgress[userId]) {
      allProgress[userId] = {};
    }
    
    if (!allProgress[userId][subjectId]) {
      allProgress[userId][subjectId] = {
        subjectName: subjectName,
        currentUnit: 1,
        completedUnits: [],
        exercises: [],
        correctAnswersByUnit: {}
      };
    }
    
    // Asegurar que existe el nombre de la materia
    if (!allProgress[userId][subjectId].subjectName) {
      allProgress[userId][subjectId].subjectName = subjectName;
    }
    
    // Actualizar contador de respuestas correctas por unidad
    if (!allProgress[userId][subjectId].correctAnswersByUnit) {
      allProgress[userId][subjectId].correctAnswersByUnit = {};
    }
    
    allProgress[userId][subjectId].correctAnswersByUnit[unitId] = correctCount;
    allProgress[userId][subjectId].lastUpdated = new Date().toISOString();
    
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
    return true;
  } catch (error) {
    console.error('❌ Error actualizando contador:', error);
    return false;
  }
};

/**
 * Obtiene el contador de respuestas correctas de una unidad
 * @param {string} userId - ID del usuario
 * @param {string} subjectId - ID de la materia
 * @param {number} unitId - ID de la unidad
 * @returns {number} Número de respuestas correctas
 */
export const getCorrectAnswersCount = (userId, subjectId, unitId) => {
  try {
    const allProgress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    
    if (allProgress[userId] && 
        allProgress[userId][subjectId] && 
        allProgress[userId][subjectId].correctAnswersByUnit) {
      return allProgress[userId][subjectId].correctAnswersByUnit[unitId] || 0;
    }
    
    return 0;
  } catch (error) {
    console.error('❌ Error obteniendo contador:', error);
    return 0;
  }
};

/**
 * Agrega un ejercicio al historial local
 * @param {string} userId - ID del usuario
 * @param {string} subjectId - ID de la materia
 * @param {string} subjectName - Nombre de la materia
 * @param {Object} exerciseData - Datos del ejercicio
 */
export const addExerciseToHistory = (userId, subjectId, subjectName, exerciseData) => {
  try {
    const allProgress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    
    if (!allProgress[userId]) {
      allProgress[userId] = {};
    }
    
    if (!allProgress[userId][subjectId]) {
      allProgress[userId][subjectId] = {
        subjectName: subjectName,
        currentUnit: 1,
        completedUnits: [],
        exercises: []
      };
    }
    
    // Asegurar que existe el nombre de la materia
    if (!allProgress[userId][subjectId].subjectName) {
      allProgress[userId][subjectId].subjectName = subjectName;
    }
    
    if (!allProgress[userId][subjectId].exercises) {
      allProgress[userId][subjectId].exercises = [];
    }
    
    // Agregar ejercicio
    allProgress[userId][subjectId].exercises.push({
      ...exerciseData,
      attemptedAt: new Date().toISOString()
    });
    
    allProgress[userId][subjectId].lastUpdated = new Date().toISOString();
    
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
    return true;
  } catch (error) {
    console.error('❌ Error agregando ejercicio:', error);
    return false;
  }
};

/**
 * Marca una unidad como completada
 * @param {string} userId - ID del usuario
 * @param {string} subjectId - ID de la materia
 * @param {string} subjectName - Nombre de la materia
 * @param {number} unitId - ID de la unidad
 */
export const completeUnitLocally = (userId, subjectId, subjectName, unitId) => {
  try {
    const allProgress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    
    if (!allProgress[userId]) {
      allProgress[userId] = {};
    }
    
    if (!allProgress[userId][subjectId]) {
      allProgress[userId][subjectId] = {
        subjectName: subjectName,
        currentUnit: 1,
        completedUnits: [],
        exercises: []
      };
    }
    
    // Asegurar que existe el nombre de la materia
    if (!allProgress[userId][subjectId].subjectName) {
      allProgress[userId][subjectId].subjectName = subjectName;
    }
    
    // Verificar si ya está completada
    const alreadyCompleted = allProgress[userId][subjectId].completedUnits.some(
      u => u.unitId === unitId
    );
    
    if (!alreadyCompleted) {
      allProgress[userId][subjectId].completedUnits.push({
        unitId,
        completedAt: new Date().toISOString()
      });
    }
    
    // Avanzar a la siguiente unidad
    allProgress[userId][subjectId].currentUnit = unitId + 1;
    allProgress[userId][subjectId].lastUpdated = new Date().toISOString();
    
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
    return true;
  } catch (error) {
    console.error('❌ Error completando unidad:', error);
    return false;
  }
};

/**
 * Limpia el progreso local de un usuario (útil al cerrar sesión)
 */
export const clearLocalProgress = (userId) => {
  try {
    const allProgress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    
    if (allProgress[userId]) {
      delete allProgress[userId];
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
      console.log('🗑️ Progreso local limpiado para usuario:', userId);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error limpiando progreso:', error);
    return false;
  }
};

/**
 * Sincroniza el progreso local con el servidor
 * @param {string} userId - ID del usuario
 * @param {Object} serverProgress - Progreso desde el servidor
 */
export const syncWithServer = (userId, subjectId, serverProgress) => {
  try {
    const localProgress = getLocalProgress(userId, subjectId);
    
    // Si hay progreso local y es más reciente, mantenerlo
    if (localProgress && localProgress.lastUpdated) {
      const localDate = new Date(localProgress.lastUpdated);
      const serverDate = serverProgress.lastAccessed ? new Date(serverProgress.lastAccessed) : new Date(0);
      
      if (localDate > serverDate) {
        console.log('📊 Progreso local más reciente, manteniéndolo');
        return localProgress;
      }
    }
    
    // Si el progreso del servidor es más reciente o no hay local, usar servidor
    console.log('📊 Usando progreso del servidor');
    saveLocalProgress(userId, subjectId, serverProgress);
    return serverProgress;
  } catch (error) {
    console.error('❌ Error sincronizando:', error);
    return serverProgress;
  }
};
