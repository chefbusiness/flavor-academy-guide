
// Utility to clean migration state from localStorage
export const cleanMigrationState = () => {
  try {
    // Remove all migration-related localStorage keys
    localStorage.removeItem('school-images-migration-executed');
    localStorage.removeItem('real-school-images-migration-executed');
    
    console.log('🧹 Migration state cleaned from localStorage');
  } catch (error) {
    console.error('Error cleaning migration state:', error);
  }
};

// Execute cleanup immediately when this module is imported
cleanMigrationState();
