#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Add error handling for unhandled exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.log('\n❌ Unhandled error occurred:', reason);
  rl.close();
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.log('\n❌ Unexpected error:', error.message);
  rl.close();
  process.exit(1);
});

function runCommand(command, description) {
  try {
    console.log(`📝 ${description}...`);
    execSync(command, { stdio: 'pipe' });
    console.log(`✅ ${description} completed`);
    return true;
  } catch (error) {
    console.log(`❌ ${description} failed:`, error.message);
    return false;
  }
}

async function setupGitHub() {
  try {
    console.log('\n🔗 CONNECTING TO GITHUB...');
    console.log('=====================\n');

    console.log('Please create a GitHub repository first:');
    console.log('1. Go to: https://github.com/new');
    console.log('2. Repository name: mangaka-ai');
    console.log('3. Set to Public');
    console.log('4. Don\'t initialize with README');
    console.log('5. Click Create repository\n');

    rl.question('Enter your GitHub username: ', (username) => {
      try {
        if (!username || username.trim() === '') {
          console.log('❌ Error: Username cannot be empty!');
          rl.close();
          return;
        }

        username = username.trim();
        console.log(`\n🚀 Setting up repository for: ${username}`);

        // Check if git is available
        if (!runCommand('git --version', 'Checking Git availability')) {
          console.log('\n💡 Please install Git first: https://git-scm.com/download');
          rl.close();
          return;
        }

        // Try to add remote
        const remoteUrl = `https://github.com/${username}/mangaka-ai.git`;
        
        if (!runCommand(`git remote add origin ${remoteUrl}`, 'Adding GitHub remote')) {
          console.log('📝 Remote might already exist, trying to update URL...');
          if (!runCommand(`git remote set-url origin ${remoteUrl}`, 'Updating remote URL')) {
            console.log('❌ Failed to set remote URL');
            rl.close();
            return;
          }
        }

        // Set branch to main
        if (!runCommand('git branch -M main', 'Setting branch to main')) {
          console.log('⚠️ Warning: Could not rename branch to main, continuing...');
        }

        // Push to GitHub
        console.log('\n🚀 Pushing to GitHub...');
        if (!runCommand('git push -u origin main', 'Pushing to GitHub')) {
          console.log('\n🔧 Push failed! Here are manual steps:');
          console.log(`1. Go to: https://github.com/${username}/mangaka-ai`);
          console.log('2. Make sure the repository exists and is public');
          console.log('3. Run these commands manually:');
          console.log('   git remote add origin ' + remoteUrl);
          console.log('   git branch -M main');
          console.log('   git push -u origin main');
          console.log('\n💡 If authentication fails, try:');
          console.log('   git config --global credential.helper manager');
          rl.close();
          return;
        }

        console.log('\n✅ SUCCESS! Your code is now on GitHub!');
        console.log(`🔗 Repository URL: https://github.com/${username}/mangaka-ai`);
        console.log('\n📋 NEXT STEPS:');
        console.log('1. Go to https://vercel.com/dashboard');
        console.log('2. Click "Import Git Repository"');
        console.log('3. Select your mangaka-ai repository');
        console.log('4. Add environment variables');
        console.log('5. Deploy!');

        rl.close();

      } catch (error) {
        console.log('\n❌ Unexpected error:', error.message);
        console.log('\n🔧 Try manual setup instead:');
        console.log('1. Create repository on GitHub');
        console.log('2. Run: git remote add origin https://github.com/YOUR-USERNAME/mangaka-ai.git');
        console.log('3. Run: git push -u origin main');
        rl.close();
      }
    });

  } catch (error) {
    console.log('\n❌ Setup failed:', error.message);
    rl.close();
  }
}

setupGitHub();