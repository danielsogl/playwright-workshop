import { expect, test } from '@playwright/test';
import { Ajv } from 'ajv';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

test.describe('JSON Placeholder API', { tag: ['@api'] }, () => {
  test('Hole mir die Liste aller Users', async ({ request }) => {
    const response = await request.get(
      'https://jsonplaceholder.typicode.com/users',
    );

    const data = await response.json();

    expect(response.status()).toBe(200);
    expect(data.length).toEqual(10);
  });

  test('Erstelle einen Test User', async ({ request }) => {
    const response = await request.post(
      'https://jsonplaceholder.typicode.com/users',
      {
        data: {
          name: 'Test User',
          username: 'Test User',
          email: 'test@test.com',
        },
      },
    );

    const data = await response.json();

    expect(response.status()).toBe(201);
    expect(data.id).toEqual(11);
  });

  test('Aktualisiere einen User', async ({ request }) => {
    const response = await request.put(
      'https://jsonplaceholder.typicode.com/users/1',
      {
        data: { name: 'Test User Updated' },
      },
    );

    const data = await response.json();

    expect(response.status()).toBe(200);
    expect(data.name).toEqual('Test User Updated');
  });

  test('Lade alle News Items', async ({ request }) => {
    const response = await request.get('/api/news/public');

    const data = await response.json();

    expect(response.status()).toBe(200);
    expect(data.length).toEqual(data.length);
  });

  test('Validiere User Schema', async ({ request }) => {
    const response = await request.get(
      'https://jsonplaceholder.typicode.com/users/1',
    );

    const schema = {
      type: 'object',
      properties: {
        id: { type: 'integer' },
      },
      required: ['id'],
      additionalProperties: true,
    };

    const data = await response.json();

    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(data);

    expect(valid).toBe(true);
  });
});
