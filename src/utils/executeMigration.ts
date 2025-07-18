import { supabase } from '@/integrations/supabase/client'

export const executeImageMigration = async () => {
  try {
    console.log('🚀 Ejecutando migración de imágenes a Supabase Storage...')
    
    const { data, error } = await supabase.functions.invoke('migrate-images-to-storage', {
      body: {}
    })

    if (error) {
      console.error('Error en migración:', error)
      throw error
    }

    console.log('✅ Migración completada:', data)
    return data
    
  } catch (error) {
    console.error('❌ Error ejecutando migración:', error)
    throw error
  }
}

// Check if migration has already been executed
const MIGRATION_KEY = 'school-images-migration-executed'
const hasMigrationExecuted = localStorage.getItem(MIGRATION_KEY) === 'true'

if (!hasMigrationExecuted) {
  // Ejecutar automáticamente la migración solo una vez
  executeImageMigration()
    .then(result => {
      console.log('🎉 Migración automática completada:', result)
      localStorage.setItem(MIGRATION_KEY, 'true')
    })
    .catch(error => {
      console.error('💥 Error en migración automática:', error)
    })
} else {
  console.log('ℹ️ Migración ya ejecutada anteriormente')
}