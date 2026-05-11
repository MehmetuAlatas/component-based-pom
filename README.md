# 🎭 Playwright Component-Based Page Object Model

![CI](https://github.com/MehmetuAlatas/component-based-pom/actions/workflows/playwright.yml/badge.svg)
![Playwright](https://img.shields.io/badge/Playwright-1.x-45ba4b?logo=playwright)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)
![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs)
![License](https://img.shields.io/badge/license-MIT-yellow)

A test automation framework built with **Playwright + TypeScript**, implementing a **Component-Based Page Object Model** architecture. Instead of one giant page class per page, the UI is broken into small, reusable **component classes** — mirroring how modern web applications (React, Vue, Angular) are actually structured.

---

## 📋 Table of Contents

- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [CI/CD](#cicd)
- [Core Concepts](#core-concepts)
- [Naming Conventions](#naming-conventions)
- [Best Practices](#best-practices)
- [License](#license)

---

## Architecture

The framework is organised into three layers. Each layer has a single responsibility and depends only on the layer below it.

```
┌─────────────────────────────────────┐
│              Tests                  │  Describe user journeys
├─────────────────────────────────────┤
│              Pages                  │  Compose components; own navigation
├──────────────┬──────────────────────┤
│  Components  │  Components  │  ...  │  Own locators + actions for one UI section
└──────────────┴──────────────────────┘
```

**Example — InventoryPage composition:**

```
InventoryPage
 ├── Navbar          → burger menu, cart icon, cart badge
 ├── SideMenu        → navigation links, logout
 └── InventoryList   → product items, add-to-cart
```

This design means a change to the Navbar selector only requires updating `Navbar.ts` — nothing else needs to change.

---

## Project Structure

```
├── .github/
│   └── workflows/
│       └── playwright.yml      # CI pipeline
│
├── components/
│   ├── LoginForm.ts            # Username & password inputs, login button
│   ├── Navbar.ts               # Burger menu, cart icon, cart badge
│   ├── SideMenu.ts             # Navigation links, logout
│   └── InventoryList.ts        # Product list, add-to-cart actions
│
├── pages/
│   ├── LoginPage.ts            # Composes: LoginForm
│   └── InventoryPage.ts        # Composes: Navbar, SideMenu, InventoryList
│
├── tests/
│   └── login.spec.ts
│
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js `v18+`
- npm `v9+`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/MehmetuAlatas/component-based-pom.git
cd component-based-pom

# 2. Install dependencies
npm ci

# 3. Install Playwright browsers
npx playwright install --with-deps
```

---

## Running Tests

```bash
# Run all tests (headless, all browsers in config)
npm test

# Run a specific file
npx playwright test tests/login.spec.ts

# Run in headed mode (watch the browser)
npx playwright test --headed

# Interactive UI mode
npx playwright test --ui

# View the HTML report after a run
npx playwright show-report
```

**Recommended `package.json` scripts:**

```json
{
  "scripts": {
    "test": "npx playwright test",
    "test:headed": "npx playwright test --headed",
    "test:ui": "npx playwright test --ui",
    "report": "npx playwright show-report"
  }
}
```

---

## CI/CD

Tests run automatically on every push and pull request to `main` / `master` via **GitHub Actions**.

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: lts/*

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npx playwright test

      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

After each run the **HTML report** is uploaded as a GitHub Actions artifact and retained for 30 days. Download it from the **Actions** tab → select the run → **Artifacts** section.

---

## Core Concepts

### Component class

A component maps to one discrete section of the UI. It owns its locators and exposes actions that operate only within that section.

```typescript
// components/Navbar.ts
export class Navbar {
  readonly burgerMenuButton: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.burgerMenuButton = page.locator("#react-burger-menu-btn");
    this.cartBadge = page.locator(".shopping_cart_badge");
  }

  async openMenu() {
    await this.burgerMenuButton.click();
  }

  async expectCartBadgeToHaveText(expectedText: string) {
    await expect(this.cartBadge).toBeVisible();
    await expect(this.cartBadge).toHaveText(expectedText);
  }
}
```

### Page class

A page composes components and owns navigation. It does not define locators directly.

```typescript
// pages/InventoryPage.ts
export class InventoryPage {
  readonly navbar: Navbar;
  readonly sideMenu: SideMenu;
  readonly inventoryList: InventoryList;

  constructor(page: Page) {
    this.navbar = new Navbar(page);
    this.sideMenu = new SideMenu(page);
    this.inventoryList = new InventoryList(page);
  }
}
```

### Component ownership

Each UI element belongs to exactly one component. When a user action spans two components, the test coordinates them explicitly — making intent clear:

```typescript
await inventoryPage.navbar.openMenu();   // burger button lives in Navbar
await inventoryPage.sideMenu.logout();   // logout link lives in SideMenu
```

### Test

Tests import pages only — never components directly. They should read like a user story.

```typescript
test("User should see cart badge updated after adding a product to cart", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goto();
  await loginPage.loginAs("standard_user", "secret_sauce");

  await inventoryPage.inventoryList.addItemToCartByName("Sauce Labs Backpack");
  await inventoryPage.navbar.expectCartBadgeToHaveText("1");
});
```

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [Playwright](https://playwright.dev) | 1.x | Browser automation & test runner |
| [TypeScript](https://www.typescriptlang.org) | 5.x | Type safety |
| Node.js | 18+ | Runtime |

---

## Target Application

Tests run against **[SauceDemo](https://www.saucedemo.com)** — a publicly available demo e-commerce site maintained by Sauce Labs, purpose-built for practicing test automation.

---

## License

[MIT](LICENSE)