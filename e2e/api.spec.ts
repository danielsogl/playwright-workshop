import { generateMockNewsItems } from "@/e2e/data/news.data";
import test, { expect } from "@playwright/test";
import z from "zod";

interface Post {
  userId: number
  id: number
  title: string
  body: string
}

const postSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
});

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

test.describe('API Testing', () => {
  test('should fetch list of posts', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/posts`);
    expect(response.status()).toBe(200);
    const posts = await response.json() as Post[];
    expect(posts.length).toBeGreaterThan(10);

    console.log('News items', generateMockNewsItems(100));

  });

  test('should create new post', async ({ request }) => {
    const newPost = {
      title: 'foo',
      body: 'bar',
      userId: 1,
    };
    const response = await request.post(`${API_BASE_URL}/posts`, {
      data: newPost,
    });
    expect(response.status()).toBe(201);
    const createdPost = await response.json() as Post;
    expect(createdPost.id).toEqual(101);
    expect(postSchema.parse(createdPost)).toBeTruthy();
  });
});