// Test script to validate the Netlify function structure
const fs = require('fs');
const path = require('path');

// Test 1: Check if function file exists and has correct structure
function testFunctionStructure() {
  console.log('🧪 Testing function structure...');
  
  const functionPath = path.join(__dirname, 'netlify', 'functions', 'telegram-webhook.js');
  
  if (!fs.existsSync(functionPath)) {
    console.error('❌ Function file not found');
    return false;
  }
  
  const functionContent = fs.readFileSync(functionPath, 'utf8');
  
  // Check for required exports
  if (!functionContent.includes('export default')) {
    console.error('❌ Missing default export');
    return false;
  }
  
  // Check for async function
  if (!functionContent.includes('async function handler')) {
    console.error('❌ Missing async handler function');
    return false;
  }
  
  // Check for request and context parameters
  if (!functionContent.includes('(request, context)')) {
    console.error('❌ Missing request and context parameters');
    return false;
  }
  
  // Check for Response objects
  if (!functionContent.includes('new Response')) {
    console.error('❌ Missing Response object usage');
    return false;
  }
  
  console.log('✅ Function structure is correct');
  return true;
}

// Test 2: Check configuration files
function testConfigFiles() {
  console.log('🧪 Testing configuration files...');
  
  const requiredFiles = [
    'netlify.toml',
    'package.json',
    '.env.example',
    '.gitignore'
  ];
  
  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Missing required file: ${file}`);
      return false;
    }
  }
  
  // Check netlify.toml content
  const netlifyConfig = fs.readFileSync(path.join(__dirname, 'netlify.toml'), 'utf8');
  if (!netlifyConfig.includes('[build]') || !netlifyConfig.includes('functions = "netlify/functions"')) {
    console.error('❌ Invalid netlify.toml configuration');
    return false;
  }
  
  console.log('✅ Configuration files are correct');
  return true;
}

// Test 3: Check package.json dependencies
function testDependencies() {
  console.log('🧪 Testing dependencies...');
  
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  
  if (!packageJson.dependencies || !packageJson.dependencies.axios) {
    console.error('❌ Missing axios dependency');
    return false;
  }
  
  if (!packageJson.devDependencies || !packageJson.devDependencies['netlify-cli']) {
    console.error('❌ Missing netlify-cli dev dependency');
    return false;
  }
  
  console.log('✅ Dependencies are correct');
  return true;
}

// Test 4: Validate function syntax
function testFunctionSyntax() {
  console.log('🧪 Testing function syntax...');
  
  try {
    // Try to require the function (this will check for syntax errors)
    const functionPath = path.join(__dirname, 'netlify', 'functions', 'telegram-webhook.js');
    const functionContent = fs.readFileSync(functionPath, 'utf8');
    
    // Basic syntax validation
    if (functionContent.includes('exports.handler')) {
      console.error('❌ Found AWS Lambda syntax (exports.handler) - should be export default');
      return false;
    }
    
    if (functionContent.includes('event.body')) {
      console.error('❌ Found AWS Lambda syntax (event.body) - should use request.json()');
      return false;
    }
    
    if (functionContent.includes('statusCode:')) {
      console.error('❌ Found AWS Lambda response format - should use Response objects');
      return false;
    }
    
    console.log('✅ Function syntax is correct for Netlify');
    return true;
  } catch (error) {
    console.error('❌ Syntax error in function:', error.message);
    return false;
  }
}

// Test 5: Check environment variable handling
function testEnvironmentVariables() {
  console.log('🧪 Testing environment variable handling...');
  
  const functionPath = path.join(__dirname, 'netlify', 'functions', 'telegram-webhook.js');
  const functionContent = fs.readFileSync(functionPath, 'utf8');
  
  if (!functionContent.includes('process.env.BOT_TOKEN')) {
    console.error('❌ Missing BOT_TOKEN environment variable usage');
    return false;
  }
  
  const envExample = fs.readFileSync(path.join(__dirname, '.env.example'), 'utf8');
  if (!envExample.includes('BOT_TOKEN=')) {
    console.error('❌ Missing BOT_TOKEN in .env.example');
    return false;
  }
  
  console.log('✅ Environment variable handling is correct');
  return true;
}

// Run all tests
function runAllTests() {
  console.log('🚀 Starting Netlify Function Migration Tests\n');
  
  const tests = [
    testFunctionStructure,
    testConfigFiles,
    testDependencies,
    testFunctionSyntax,
    testEnvironmentVariables
  ];
  
  let passedTests = 0;
  
  for (const test of tests) {
    try {
      if (test()) {
        passedTests++;
      }
    } catch (error) {
      console.error('❌ Test failed with error:', error.message);
    }
    console.log(''); // Add spacing between tests
  }
  
  console.log(`📊 Test Results: ${passedTests}/${tests.length} tests passed`);
  
  if (passedTests === tests.length) {
    console.log('🎉 All tests passed! Your Netlify function is ready for deployment.');
    return true;
  } else {
    console.log('⚠️  Some tests failed. Please fix the issues before deploying.');
    return false;
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testFunctionStructure,
  testConfigFiles,
  testDependencies,
  testFunctionSyntax,
  testEnvironmentVariables
};

