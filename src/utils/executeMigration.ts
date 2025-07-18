import { supabase } from '@/integrations/supabase/client'

export const executeImageMigration = async () => {
  try {
    console.log('🚀 DEBUG: Iniciando migración de imágenes a Supabase Storage...')
    
    const { data, error } = await supabase.functions.invoke('migrate-images-to-storage', {
      body: {}
    })

    if (error) {
      console.error('❌ DEBUG: Error en migración:', error)
      throw error
    }

    console.log('✅ DEBUG: Migración completada:', data)
    return data
    
  } catch (error) {
    console.error('💥 DEBUG: Error ejecutando migración:', error)
    throw error
  }
}

// Check if migration has already been executed
const MIGRATION_KEY = 'school-images-migration-executed'

console.log('🔍 DEBUG: Verificando si migración ya se ejecutó...')
const hasMigrationExecuted = localStorage.getItem(MIGRATION_KEY) === 'true'
console.log('🔍 DEBUG: Migración ya ejecutada:', hasMigrationExecuted)

if (!hasMigrationExecuted) {
  console.log('🚀 DEBUG: Ejecutando migración automática...')
  // Ejecutar automáticamente la migración solo una vez
  executeImageMigration()
    .then(result => {
      console.log('🎉 DEBUG: Migración automática completada:', result)
      localStorage.setItem(MIGRATION_KEY, 'true')
    })
    .catch(error => {
      console.error('💥 DEBUG: Error en migración automática:', error)
    })
} else {
  console.log('ℹ️ DEBUG: Migración ya ejecutada anteriormente')
}