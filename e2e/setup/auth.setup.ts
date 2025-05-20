import { expect, test as setup } from '../fixtures/fixture';

import path from 'path';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

setup(
  'Login Test User',
  async ({
    page,
    emailField,
    passwordField,
    loginButton,
    testUsers,
    defaultUser,
    goToPage,
  }) => {
    await goToPage('/auth/signin');

    const user = defaultUser === 'user1' ? testUsers.user1 : testUsers.user2;

    await emailField.fill(user.email);
    await passwordField.fill(user.password);

    await loginButton.click();

    await page.waitForURL('/');

    await expect(
      page.getByRole('button', { name: 'User profile actions menu' }),
    ).toBeVisible();

    await page.context().storageState({ path: authFile });
  },
);
