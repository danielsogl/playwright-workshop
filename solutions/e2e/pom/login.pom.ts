import { type Locator, type Page } from "@playwright/test";


export class LoginPage {
  private emailInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private signUpLink: Locator;
  private page: Page;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Password");
    this.loginButton = page.getByRole("button", { name: "Submit sign in form" });
    this.signUpLink = page.getByRole("link", { name: "Navigate to sign up page" });
  }

  async navigate() {
    await this.page.goto("/auth/signin");
    await this.page.waitForURL("/auth/signin");
  }

  async login(username: string, password: string) {
    await this.emailInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL("/");
  }

  async navigateToSignUp() {
    await this.signUpLink.click();
    await this.page.waitForURL("/auth/signup");
  }
}