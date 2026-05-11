import { Locator, Page,expect } from "@playwright/test";

export class Navbar {
  readonly burgerMenuButton: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  constructor(page: Page) {
    this.burgerMenuButton = page.locator("#react-burger-menu-btn");
    this.cartLink = page.locator("#shopping_cart_container");
    this.cartBadge = page.locator(".shopping_cart_badge");
  }
  async openMenu() {
    await this.burgerMenuButton.click();
  }
  async openCart() {
    await this.cartLink.click();
  }
  async expectCartBadgeToHaveText(expectedText: string) {
    await expect(this.cartBadge).toBeVisible();
    await expect(this.cartBadge).toHaveText(expectedText);
  }
}
