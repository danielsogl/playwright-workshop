import { expect, test } from "@/e2e/fixtures/base.fixture";
import z from "zod";

const BASE_URL = "https://jsonplaceholder.typicode.com";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const postSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string()
});

test.describe("API Testing", { tag: ['@fixture'] }, () => {
  test("should return list of posts", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts`);
    const posts = await response.json() as Post[];


    expect(response.status()).toBe(200);
    expect(posts.length).toBe(100);
  });

  test("should create a new post", async ({ request }) => {
    const newPost: Omit<Post, "id"> = {
      userId: 1,
      title: "New Post",
      body: "This is a new post."
    };

    const response = await request.post(`${BASE_URL}/posts`, {
      data: newPost
    });

    const createdPost = await response.json() as Post;

    expect(response.status()).toBe(201);
    expect(createdPost).toEqual({ ...newPost, id: 101 });
    expect(postSchema.safeParse(createdPost).success).toBe(true);
  });

  test("should update an existing post", async ({ request }) => {
    const updatedPost: Partial<Post> = {
      title: "Updated Post Title"
    };

    const response = await request.put(`${BASE_URL}/posts/1`, {
      data: updatedPost
    });

    const post = await response.json() as Post;

    expect(response.status()).toBe(200);
    expect(post.title).toBe(updatedPost.title);
    expect(postSchema.safeParse(post).success).toBe(true);
  });

  test("should delete a post", async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/posts/1`);

    expect(response.status()).toBe(200);
  });

  test('should create test data', async ({ createPost }) => {
    const testData = {
      userId: 1,
      title: "Test Data",
      body: "This is test data."
    };

    const post = await createPost(testData);

    expect(post).toHaveProperty('id');
  });
});
