import { Page } from "@playwright/test";
import { LoginForm } from "../components/LoginForm";

export class LoginPage {
  readonly page: Page;
  readonly form: LoginForm;

  constructor(page: Page) {
    this.page = page;
    this.form = new LoginForm(page);
  }

  async goto() {
    await this.page.goto("https://www.saucedemo.com/");
  }

  async loginAs(username: string, password: string) {
    await this.form.login(username, password);
  }
}