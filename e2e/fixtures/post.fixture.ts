


import { test as base } from "@playwright/test";
import { fakerDE as faker } from "@faker-js/faker";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Fixtures {
  createPost: (post: Omit<Post, "id">) => Promise<Post>;
}

export const postFixture = base.extend<Fixtures>({
  createPost: async ({ request }, use) => {
    let postId: number | undefined;

    const createPost = async (post: Omit<Post, "id">): Promise<Post> => {

      const newPost = {
        userId: faker.number.int({ min: 1, max: 10 }),
        title: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(2)
      } satisfies Omit<Post, "id">;

      const response = await request.post("https://jsonplaceholder.typicode.com/posts", {
        data: post
      });

      const createdPost = await response.json() as Post;
      postId = createdPost.id;

      console.log(`Created post with ID: ${postId}`);

      return createdPost;
    };

    await use(createPost);

    if (postId) {
      await request.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
      console.log(`Deleted post with ID: ${postId}`);
    }
  }
});
