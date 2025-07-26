#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🗄️  MONGODB ATLAS SETUP');
console.log('========================\n');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupMongoDB() {
  console.log('Please provide your MongoDB Atlas connection details:\n');
  
  const username = await askQuestion('MongoDB Username: ');
  const password = await askQuestion('MongoDB Password: ');
  const cluster = await askQuestion('Cluster Name (e.g., cluster0.xxxxx): ');
  
  // Generate connection string
  const mongoUri = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/mangaka-ai?retryWrites=true&w=majority`;
  
  console.log('\n✅ MongoDB connection string generated!');
  console.log('🔗 Connection String:');
  console.log(mongoUri);
  
  // Save to .env file
  const envContent = `# MongoDB Atlas Configuration
MONGODB_URI=${mongoUri}
NODE_ENV=production
JWT_SECRET=mangaka-ai-super-secure-jwt-secret-${Date.now()}

# Add your other API keys below:
# OPENAI_API_KEY=sk-your-openai-key
# STRIPE_SECRET_KEY=sk_live_your-stripe-key
# SENDGRID_API_KEY=SG.your-sendgrid-key
`;

  fs.writeFileSync('.env.production', envContent);
  console.log('\n💾 Saved to .env.production file');
  
  console.log('\n📋 NEXT STEPS:');
  console.log('1. Add your other API keys to .env.production');
  console.log('2. Copy these environment variables to Vercel dashboard');
  console.log('3. Run: npm run go-live');
  
  rl.close();
}

setupMongoDB().catch(console.error);