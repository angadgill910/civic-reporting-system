const fs = require('fs-extra');
const path = require('path');

async function combineBuilds() {
  console.log('🚀 Combining builds for Vercel deployment...');
  
  try {
    // Create main dist directory
    await fs.ensureDir('dist');
    await fs.emptyDir('dist');
    
    // Copy landing page (root)
    console.log('📋 Copying landing page to root...');
    await fs.copy('landing-page/dist', 'dist');
    
    // Copy citizen portal to /citizen subdirectory  
    console.log('👥 Copying citizen portal to /citizen...');
    await fs.ensureDir('dist/citizen');
    await fs.copy('citizen-portal/dist', 'dist/citizen');
    
    // Copy admin dashboard to /admin subdirectory
    console.log('🔧 Copying admin dashboard to /admin...');
    await fs.ensureDir('dist/admin');
    await fs.copy('admin-dashboard/dist', 'dist/admin');
    
    console.log('✅ Build combination complete!');
    console.log('📂 Final structure:');
    console.log('   dist/');
    console.log('   ├── index.html (landing page)');  
    console.log('   ├── citizen/');
    console.log('   │   └── index.html (citizen portal)');
    console.log('   └── admin/');
    console.log('       └── index.html (admin dashboard)');
    
  } catch (error) {
    console.error('❌ Error combining builds:', error);
    process.exit(1);
  }
}

combineBuilds();