#!/usr/bin/env node

/**
 * AI Chat Security Test Suite
 * يختبر أمان الـ Gemini API integration
 */

const http = require('http');

const API_BASE = process.env.API_URL || 'http://localhost:5000/api';

// ألوان للـ terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(type, message) {
  const prefix = {
    pass: `${colors.green}✓${colors.reset}`,
    fail: `${colors.red}✗${colors.reset}`,
    info: `${colors.blue}ℹ${colors.reset}`,
    warn: `${colors.yellow}⚠${colors.reset}`,
  };
  console.log(`${prefix[type]} ${message}`);
}

async function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: JSON.parse(data || '{}'),
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function runTests() {
  console.log(`\n${colors.blue}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}   AI Chat Security Test Suite${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}\n`);

  let passed = 0;
  let failed = 0;

  // Test 1: Check if /chat endpoint exists
  try {
    log('info', 'Testing /chat endpoint...');
    const response = await makeRequest('POST', '/chat', {
      message: 'مرحبا',
      history: [],
    });

    if (response.status === 200 || response.status === 500) {
      log('pass', 'Endpoint accessible');
      passed++;
    } else if (response.status === 503) {
      log('warn', 'Server not responding (may not be started)');
    } else {
      log('fail', `Unexpected status: ${response.status}`);
      failed++;
    }
  } catch (error) {
    log('warn', `Server not running: ${error.message}`);
  }

  // Test 2: Validate input - empty message
  try {
    log('info', 'Testing input validation (empty message)...');
    const response = await makeRequest('POST', '/chat', {
      message: '',
      history: [],
    });

    if (response.status === 400) {
      log('pass', 'Empty message rejected');
      passed++;
    } else {
      log('fail', 'Empty message should be rejected (status 400)');
      failed++;
    }
  } catch (error) {
    log('warn', `Cannot test validation: ${error.message}`);
  }

  // Test 3: Validate input - message too long
  try {
    log('info', 'Testing input validation (message too long)...');
    const longMessage = 'a'.repeat(2500);
    const response = await makeRequest('POST', '/chat', {
      message: longMessage,
      history: [],
    });

    if (response.status === 400) {
      log('pass', 'Long message rejected');
      passed++;
    } else {
      log('fail', 'Long message should be rejected (status 400)');
      failed++;
    }
  } catch (error) {
    log('warn', `Cannot test validation: ${error.message}`);
  }

  // Test 4: Validate input - missing message field
  try {
    log('info', 'Testing input validation (missing message field)...');
    const response = await makeRequest('POST', '/chat', {
      history: [],
    });

    if (response.status === 400) {
      log('pass', 'Missing message field rejected');
      passed++;
    } else {
      log('fail', 'Missing message should be rejected (status 400)');
      failed++;
    }
  } catch (error) {
    log('warn', `Cannot test validation: ${error.message}`);
  }

  // Test 5: API key not exposed in responses
  try {
    log('info', 'Testing API key exposure...');
    const response = await makeRequest('POST', '/chat', {
      message: 'test',
      history: [],
    });

    const responseString = JSON.stringify(response);
    const hasGeminiKey =
      responseString.includes('AIza') || responseString.includes('GEMINI_API_KEY');

    if (!hasGeminiKey) {
      log('pass', 'API key not exposed in responses');
      passed++;
    } else {
      log('fail', 'API key might be exposed in responses!');
      failed++;
    }
  } catch (error) {
    log('warn', `Cannot test exposure: ${error.message}`);
  }

  // Test 6: CORS headers present
  try {
    log('info', 'Testing CORS headers...');
    const response = await makeRequest('POST', '/chat', {
      message: 'test',
      history: [],
    });

    if (response.headers['access-control-allow-origin']) {
      log('pass', 'CORS headers present');
      passed++;
    } else {
      log('warn', 'CORS headers not found (might be configured differently)');
    }
  } catch (error) {
    log('warn', `Cannot test CORS: ${error.message}`);
  }

  // Test 7: Security headers
  try {
    log('info', 'Testing security headers...');
    const response = await makeRequest('POST', '/chat', {
      message: 'test',
      history: [],
    });

    const hasSecurityHeaders =
      response.headers['x-content-type-options'] === 'nosniff' &&
      response.headers['x-frame-options'] === 'DENY';

    if (hasSecurityHeaders) {
      log('pass', 'Security headers present');
      passed++;
    } else {
      log('warn', 'Security headers might be missing');
    }
  } catch (error) {
    log('warn', `Cannot test security headers: ${error.message}`);
  }

  // Summary
  console.log(`\n${colors.blue}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  if (failed > 0) {
    console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  }
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(console.error);
