import { supabase } from '@/integrations/supabase/client'

export const executeRealMigration = async () => {
  try {
    console.log('🚀 EJECUTANDO MIGRACIÓN REAL...')
    
    const { data, error } = await supabase.functions.invoke('real-migration-to-storage', {
      body: {}
    })

    if (error) {
      console.error('❌ Error en migración real:', error)
      throw error
    }

    console.log('✅ MIGRACIÓN REAL COMPLETADA:', data)
    return data
    
  } catch (error) {
    console.error('💥 Error ejecutando migración real:', error)
    throw error
  }
}

// Check if REAL migration has already been executed
const REAL_MIGRATION_KEY = 'real-school-images-migration-executed'

console.log('🔍 Verificando si migración REAL ya se ejecutó...')
const hasRealMigrationExecuted = localStorage.getItem(REAL_MIGRATION_KEY) === 'true'
console.log('🔍 Migración REAL ya ejecutada:', hasRealMigrationExecuted)

if (!hasRealMigrationExecuted) {
  console.log('🚀 Ejecutando migración REAL...')
  // Limpiar migración antigua
  localStorage.removeItem('school-images-migration-executed')
  
  // Ejecutar la migración real
  executeRealMigration()
    .then(result => {
      console.log('🎉 MIGRACIÓN REAL EXITOSA:', result)
      localStorage.setItem(REAL_MIGRATION_KEY, 'true')
      
      // Recargar la página para ver los cambios
      setTimeout(() => {
        console.log('🔄 Recargando página para mostrar nuevas imágenes...')
        window.location.reload()
      }, 3000)
    })
    .catch(error => {
      console.error('💥 MIGRACIÓN REAL FALLÓ:', error)
    })
} else {
  console.log('ℹ️ Migración REAL ya ejecutada anteriormente')
}