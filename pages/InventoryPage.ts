import { Page } from "@playwright/test";
import { Navbar } from "../components/Navbar";
import { SideMenu } from "../components/SideMenu";
import { InventoryList } from "../components/InventoryList";
export class InventoryPage {
  readonly page: Page;
  readonly navbar: Navbar;
  readonly sideMenu: SideMenu;
  readonly inventoryList: InventoryList;
  constructor(page: Page) {
    this.page = page;
    this.navbar = new Navbar(page);
    this.sideMenu = new SideMenu(page);
    this.inventoryList = new InventoryList(page);
  }
}
