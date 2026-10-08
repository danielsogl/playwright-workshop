import { Page, Locator } from '@playwright/test';
import { NewsPage } from './NewsPage';
import { LoginPage } from './LoginPage';

export class HomePage {
  readonly page: Page;
  readonly navigation: Locator;
  readonly newsLink: Locator;
  readonly signInLink: Locator;
  readonly logo: Locator;
  readonly themeToggle: Locator;

  constructor(page: Page) {
    this.page = page;

    this.navigation = page.getByRole('navigation', {
      name: 'Main navigation',
    });
    this.newsLink = page.getByRole('link', { name: 'View Public News' });
    this.signInLink = page.getByRole('link', {
      name: 'Sign in to your account',
    });
    this.logo = page.getByRole('link', { name: 'Go to homepage' });
    this.themeToggle = page.getByRole('switch');
  }

  async goto(): Promise<this> {
    await this.page.goto('/');
    return this;
  }

  // Navigation Methods: Seitenwechsel liefern das nächste Page Object zurück
  async navigateToNews(): Promise<NewsPage> {
    await this.newsLink.click();
    await this.page.waitForURL('/news/public');
    return new NewsPage(this.page);
  }

  async navigateToSignIn(): Promise<LoginPage> {
    await this.signInLink.click();
    await this.page.waitForURL('/auth/signin');
    return new LoginPage(this.page);
  }

  // Links der Hauptnavigation, z. B. 'Clock', 'File Download', 'Fixtures Demo'
  async navigateTo(label: string) {
    await this.navigation
      .getByRole('link', { name: `Navigate to ${label}` })
      .click();
  }

  async navigateToHome() {
    await this.logo.click();
    await this.page.waitForURL('/');
  }

  // Theme Actions: den Wechsel prüft der Test, z. B. per toHaveAttribute
  async toggleTheme() {
    await this.themeToggle.click();
  }
}
