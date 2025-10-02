import assert from 'assert';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error('Set NEXT_PUBLIC_API_URL before running API integration tests.');
}

async function runTests() {
  console.log('Starting API tests...');

  const randomString = () => Math.random().toString(36).substring(7);
  const testUser = {
    username: `testuser_${randomString()}`,
    email: `test_${randomString()}@example.com`,
    password: 'Password123!',
  };
  let authToken = '';
  let testNovelId = '';
  let testChapterId = '';

  try {
    // Test 1: Register a new user
    console.log('Test 1: Registering a new user...');
    const regResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    const regData = await regResponse.json();
    assert.strictEqual(regResponse.status, 201, `Registration failed: ${regData.message}`);
    assert.strictEqual(regData.message, 'User created successfully');
    console.log('✅ User registration successful.');

    // Test 2: Log in with the new user
    console.log('Test 2: Logging in...');
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: testUser.email, password: testUser.password }),
    });
    const loginData = await loginResponse.json();
    assert.strictEqual(loginResponse.status, 200, `Login failed: ${loginData.message}`);
    assert.ok(loginData.token, 'Login token not received.');
    authToken = loginData.token;
    console.log('✅ User login successful.');

    // Test 3: Get user details
    console.log('Test 3: Fetching user details...');
    const meResponse = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const meData = await meResponse.json();
    assert.strictEqual(meResponse.status, 200, `/me endpoint failed: ${meData.message}`);
    assert.strictEqual(meData.email, testUser.email, 'Fetched user email does not match.');
    console.log('✅ Fetched user details successfully.');

    // Test 4: Create a novel
    console.log('Test 4: Creating a novel...');
    const novelResponse = await fetch(`${BASE_URL}/novels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ title: 'Test Novel', genre: 'Fantasy', synopsis: 'A test novel.' }),
    });
    const novelData = await novelResponse.json();
    assert.strictEqual(novelResponse.status, 201, `Novel creation failed: ${novelData.message}`);
    assert.ok(novelData.id, 'Novel ID not received.');
    testNovelId = novelData.id;
    console.log('✅ Novel creation successful.');

    // Test 5: Create a chapter
    console.log('Test 5: Creating a chapter...');
    const chapterResponse = await fetch(`${BASE_URL}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ novelId: testNovelId, title: 'Test Chapter', content: 'Once upon a time...' }),
    });
    const chapterData = await chapterResponse.json();
    assert.strictEqual(chapterResponse.status, 201, `Chapter creation failed: ${chapterData.message}`);
    assert.ok(chapterData.id, 'Chapter ID not received.');
    testChapterId = chapterData.id;
    console.log('✅ Chapter creation successful.');

    console.log('\nAll tests passed! 🎉');

  } catch (error) {
    console.error('\n💥 A test failed:');
    console.error(error);
    process.exit(1);
  }
}

runTests();
