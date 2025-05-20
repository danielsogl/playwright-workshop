import { test as setup } from '../fixtures/fixture';

import path from 'path';
import { LoginPage } from '../pom/login.pom';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

setup('Login Test User', async ({ page, testUsers, defaultUser }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goToPage();

  const user = defaultUser === 'user1' ? testUsers.user1 : testUsers.user2;

  await loginPage.login(user.email, user.password);

  await page.context().storageState({ path: authFile });
});
