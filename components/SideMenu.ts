import { Locator, Page } from "@playwright/test";
export class SideMenu {
  readonly closeButton: Locator;
  readonly allItemsLink: Locator;
  readonly logoutLink: Locator;
  constructor(page: Page) {
    this.closeButton = page.locator("#react-burger-cross-btn");
    this.allItemsLink = page.locator("#inventory_sidebar_link");
    this.logoutLink = page.locator("#logout_sidebar_link");
  }
  async logout() {
    await this.logoutLink.click();
  }
  async close() {
    await this.closeButton.click();
  }
}
