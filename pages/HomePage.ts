import { expect, Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com');
  }

  async logIn(userName: string, password: string) {
    const loginButton = this.page.getByRole('button', { name: 'Login'})
    await expect(loginButton).toBeVisible()

    await this.page.fill('#user-name', userName)
    await this.page.fill('#password', password)
    await loginButton.click()

    await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html')
    await expect(this.page.locator('.app_logo')).toBeVisible()
    await expect(this.page.getByText('Products')).toBeVisible()
  }
}
