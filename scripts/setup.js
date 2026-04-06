const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(command, cwd = process.cwd()) {
  console.log(`> Running: ${command} (in ${cwd})`);
  try {
    execSync(command, { stdio: 'inherit', cwd });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    process.exit(1);
  }
}

console.log('--- Tesla Energy Site Planner: Bootstrap ---');

// 1. Install dependencies
console.log('\n[1/3] Installing dependencies...');
run('npm install');

// 2. Setup environment files
console.log('\n[2/3] Setting up environment files...');
const backendEnvPath = path.join(__dirname, '..', 'backend', '.env');
const backendEnvExamplePath = path.join(__dirname, '..', 'backend', '.env.example');

if (!fs.existsSync(backendEnvPath)) {
  if (fs.existsSync(backendEnvExamplePath)) {
    console.log(`Copying ${backendEnvExamplePath} to ${backendEnvPath}`);
    fs.copyFileSync(backendEnvExamplePath, backendEnvPath);
  } else {
    console.warn(`Warning: ${backendEnvExamplePath} not found. Skipping env setup.`);
  }
} else {
  console.log('.env already exists in backend directory.');
}

// 3. Build shared library
console.log('\n[3/3] Building shared library (@tesla/shared)...');
run('npm run build -w @tesla/shared');

console.log('\n🎉 Setup complete! Proceeding to start applications...');
console.log('--------------------------------------------------');
