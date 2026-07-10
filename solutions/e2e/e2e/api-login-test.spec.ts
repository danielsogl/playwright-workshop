import { test, expect } from '@playwright/test';

test.describe('API Login Test', () => {
  test('should login via API and test authenticated endpoints', async ({
    page,
  }) => {
    // Use page.request so the session cookie is shared with the page context
    // (the standalone `request` fixture has its own, separate cookie jar).
    const api = page.request;

    // Step 1: Get CSRF token from Auth.js
    const csrfResponse = await api.get('/api/auth/csrf');
    expect(csrfResponse.status()).toBe(200);
    const { csrfToken } = await csrfResponse.json();

    // Step 2: API-Login. Auth.js v5 signs in via the credentials *callback*
    // endpoint with a form-encoded body; `json: 'true'` returns 200 + JSON
    // instead of a 302 redirect.
    const loginResponse = await api.post('/api/auth/callback/credentials', {
      form: {
        email: 'test@example.com',
        password: 'password',
        csrfToken,
        callbackUrl: '/',
        json: 'true',
      },
    });

    expect([200, 302]).toContain(loginResponse.status());

    // Step 3: Verify session contains user data
    const sessionResponse = await api.get('/api/auth/session');
    expect(sessionResponse.status()).toBe(200);

    const sessionData = await sessionResponse.json();
    expect(sessionData.user).toBeDefined();
    expect(sessionData.user.email).toBe('test@example.com');

    // Step 4: Test protected API route with authentication
    const userResponse = await api.get('/api/user');
    expect(userResponse.status()).toBe(200);

    const userData = await userResponse.json();
    expect(userData.email).toBe('test@example.com');
    expect(userData.name).toBe('Test User');

    // Step 5: Test UI verification (optional - to show the user is logged in)
    await page.goto('/');
    const userMenu = page.getByRole('button', {
      name: /user profile actions menu/i,
    });
    await expect(userMenu).toBeVisible();
  });

  test('should test signup API endpoints', async ({ request }) => {
    // Test signup API with unique email
    const randomId = Math.random().toString(36).substring(2, 15) + Date.now();
    const newUser = {
      name: 'API Test User',
      email: `apitest${randomId}@example.com`,
      password: 'testpassword123',
    };

    const signupResponse = await request.post('/api/auth/signup', {
      data: newUser,
    });

    expect(signupResponse.status()).toBe(201);

    const signupData = await signupResponse.json();
    expect(signupData.message).toBe('User created successfully');
    expect(signupData.user.email).toBe(newUser.email);

    // Test duplicate email handling using existing user from data.json
    const duplicateResponse = await request.post('/api/auth/signup', {
      data: {
        name: 'Duplicate User',
        email: 'test@example.com', // Using existing email from data.json
        password: 'password123',
      },
    });

    expect(duplicateResponse.status()).toBe(409);

    const duplicateData = await duplicateResponse.json();
    expect(duplicateData.message).toContain('already registered');

    // Test validation errors
    const invalidData = {
      name: '', // Empty name
      email: 'invalid-email', // Invalid email format
      password: '123', // Too short password
    };

    const validationResponse = await request.post('/api/auth/signup', {
      data: invalidData,
    });

    expect(validationResponse.status()).toBe(400);

    const validationData = await validationResponse.json();
    expect(validationData.message).toBe('Validation failed');
    expect(validationData.errors).toBeDefined();
  });
});
