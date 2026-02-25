import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from './fixtures/base.fixture';
// import { LoginPage } from "@/e2e/pom/login.pom";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const authPath = path.join(__dirname, "../playwright/.auth/user.json");

test.describe("Login User", () => {
  test("should login test user", async ({ page, testUser, pages, user }) => {
    const { username, password } = testUser;
    await pages.loginPage.navigate();
    await pages.loginPage.login(username, password);

    await page.context().storageState({ path: authPath });
  });
});