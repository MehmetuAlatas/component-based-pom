import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";

test("User should see cart badge updated after adding a product to cart", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goto();
  await loginPage.loginAs("standard_user", "secret_sauce");

  await inventoryPage.inventoryList.addItemToCartByName("Sauce Labs Backpack");

  await inventoryPage.navbar.expectCartBadgeToHaveText("1");
});
