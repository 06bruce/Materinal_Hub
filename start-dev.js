#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Maternal Health Hub Development Environment...\n');

// Function to start a service
function startService(name, command, args, cwd) {
  console.log(`📦 Starting ${name}...`);
  
  const child = spawn(command, args, {
    cwd: path.join(__dirname, cwd),
    stdio: 'inherit',
    shell: true
  });

  child.on('error', (error) => {
    console.error(`❌ Error starting ${name}:`, error.message);
  });

  child.on('close', (code) => {
    console.log(`🔚 ${name} process exited with code ${code}`);
  });

  return child;
}

// Start backend
const backend = startService('Backend', 'npm', ['run', 'dev'], 'backend');

// Wait a bit for backend to start, then start frontend
setTimeout(() => {
  console.log('\n⏳ Backend starting, launching frontend in 3 seconds...\n');
  
  setTimeout(() => {
    const frontend = startService('Frontend', 'npm', ['start'], 'frontend');
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down services...');
      backend.kill('SIGINT');
      frontend.kill('SIGINT');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 Shutting down services...');
      backend.kill('SIGTERM');
      frontend.kill('SIGTERM');
      process.exit(0);
    });
  }, 3000);
}, 1000);

console.log('\n📋 Services will be available at:');
console.log('   Backend:  http://localhost:3001');
console.log('   Frontend: http://localhost:3000');
console.log('\n🔄 Press Ctrl+C to stop all services\n');
