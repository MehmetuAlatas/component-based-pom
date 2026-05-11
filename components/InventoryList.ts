import { Locator, Page } from "@playwright/test";
export class InventoryList {
  readonly items: Locator;
  constructor(page: Page) {
    this.items = page.locator(".inventory_item");
  }
  async getItemCount(): Promise<number> {
    return await this.items.count();
  }
  async addItemToCartByName(name: string) {
    const item = this.items.filter({ hasText: name });
    const addButton = item.locator("button", { hasText: "Add to cart" });
    await addButton.click();
  }
}
