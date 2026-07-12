import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly navigation: Locator;
  readonly newsLink: Locator;
  readonly aboutLink: Locator;
  readonly blogLink: Locator;
  readonly pricingLink: Locator;
  readonly signInLink: Locator;
  readonly logo: Locator;
  readonly themeToggle: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation Elements - use flexible selectors
    this.navigation = page.getByRole('navigation').first();
    this.newsLink = page.getByRole('link', {
      name: 'View Public News',
    });
    this.aboutLink = page.getByRole('link', { name: /about/i });
    this.blogLink = page.getByRole('link', { name: /blog/i });
    this.pricingLink = page.getByRole('link', { name: /pricing/i });
    this.signInLink = page.getByRole('link', { name: /sign in/i });
    this.logo = page.getByRole('link', { name: /home/i }).first();
    this.themeToggle = page.getByRole('switch').first();
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Navigation Methods
  async navigateToNews() {
    if ((await this.newsLink.count()) > 0) {
      await this.newsLink.click();
      await this.page.waitForURL('/news/public');
    } else {
      await this.page.goto('/news/public');
    }
  }

  async navigateToAbout() {
    if ((await this.aboutLink.count()) > 0) {
      await this.aboutLink.click();
      await this.page.waitForURL('/about');
    } else {
      await this.page.goto('/about');
    }
  }

  async navigateToBlog() {
    if ((await this.blogLink.count()) > 0) {
      await this.blogLink.click();
      await this.page.waitForURL('/blog');
    } else {
      await this.page.goto('/blog');
    }
  }

  async navigateToPricing() {
    if ((await this.pricingLink.count()) > 0) {
      await this.pricingLink.click();
      await this.page.waitForURL('/pricing');
    } else {
      await this.page.goto('/pricing');
    }
  }

  async navigateToSignIn() {
    await this.signInLink.click();
    await this.page.waitForURL('**/auth/signin');
  }

  async navigateToHome() {
    await this.logo.click();
    await this.page.waitForURL('/');
  }

  // Theme Actions
  async toggleTheme() {
    await this.themeToggle.click();
    await this.page.waitForTimeout(100); // Small delay for theme transition
  }

  async getCurrentTheme(): Promise<string> {
    const htmlElement = this.page.locator('html');
    const classAttribute = (await htmlElement.getAttribute('class')) || '';
    const dataTheme = (await htmlElement.getAttribute('data-theme')) || '';
    return classAttribute.includes('dark') || dataTheme.includes('dark')
      ? 'dark'
      : 'light';
  }

  // Status Checks
  async isUserLoggedIn(): Promise<boolean> {
    const signOutButton = this.page
      .getByRole('button', { name: /sign out|logout/i })
      .or(this.page.getByRole('link', { name: /sign out|logout/i }));
    return await signOutButton.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }
}
