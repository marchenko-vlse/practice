import { test, expect, Locator } from '@playwright/test';
import { describe } from 'node:test';

describe('Positive test cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/')
    const loginButton = page.getByRole('button', { name: 'Login'})
    await expect(loginButton).toBeVisible()

    await page.fill('#user-name', 'standard_user')
    await page.fill('#password', 'secret_sauce')
    await loginButton.click()

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
    await expect(page.locator('.app_logo')).toBeVisible()
    await expect(page.getByText('Products')).toBeVisible()
  })

  test('E2E', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Add to cart' })).toHaveCount(6)

    let itemNames: string[] = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 
                               'Sauce Labs Bolt T-Shirt', 'Sauce Labs Fleece Jacket', 
                               'Sauce Labs Onesie', 'Test.allTheThings() T-Shirt (Red)'
    ]
    await page.locator('.product_sort_container').selectOption('az');
    await expect(page.getByRole('button', { name: 'Add to cart' })).toHaveCount(6)
    await expect(page.locator('.inventory_item_name')).toHaveText(itemNames)

    itemNames.reverse()
    await page.locator('.product_sort_container').selectOption('za');
    await expect(page.getByRole('button', { name: 'Add to cart' })).toHaveCount(6)
    await expect(page.locator('.inventory_item_name')).toHaveText(itemNames)

    await page.locator('.shopping_cart_link').click()
    await page.locator('#continue-shopping').click()

    itemNames = ['Sauce Labs Onesie', 'Sauce Labs Bike Light', 
      'Sauce Labs Bolt T-Shirt', 'Test.allTheThings() T-Shirt (Red)',
      'Sauce Labs Backpack', 'Sauce Labs Fleece Jacket'
    ]
    await page.locator('.product_sort_container').selectOption('lohi');
    await expect(page.getByRole('button', { name: 'Add to cart' })).toHaveCount(6)
    await expect(page.locator('.inventory_item_name')).toHaveText(itemNames)

    itemNames = ['Sauce Labs Fleece Jacket', 'Sauce Labs Backpack',
                 'Sauce Labs Bolt T-Shirt', 'Test.allTheThings() T-Shirt (Red)',
                 'Sauce Labs Bike Light', 'Sauce Labs Onesie'
    ]
    await page.locator('.product_sort_container').selectOption('hilo');
    await expect(page.getByRole('button', { name: 'Add to cart' })).toHaveCount(6)
    await expect(page.locator('.inventory_item_name')).toHaveText(itemNames)

    await page.locator('#add-to-cart-sauce-labs-backpack').click()
    await page.locator('#add-to-cart-sauce-labs-bolt-t-shirt').click()
    await expect(page.getByRole('button', { name: 'Add to cart' })).toHaveCount(4)

    await page.locator('#remove-sauce-labs-backpack').click()
    await expect(page.getByRole('button', { name: 'Add to cart' })).toHaveCount(5)
    
    await page.locator('.shopping_cart_badge').click()
    
    await page.locator('#checkout').click()
    
    await page.fill('#first-name', 'Testname')
    await page.fill('#last-name', 'Testlastname')
    await page.fill('#postal-code', '1234')
    await page.locator('#continue').click()
    
    await expect(page.getByText('Item total: $15.99')).toBeVisible()
    await expect(page.getByText('Tax: $1.28')).toBeVisible()
    await expect(page.getByText('Total: $17.27')).toBeVisible()
    
    await page.locator('#finish').click()
    await expect(page.getByText('Thank you for your order!')).toBeVisible()
    await page.locator('#back-to-products').click()
    await expect(page.getByText('Products')).toBeVisible()

    await page.locator('#react-burger-menu-btn').click()
    await page.locator('#logout_sidebar_link').click()
    await expect(page.getByRole('button', { name: 'Login'})).toBeVisible()
  })
})

describe('Negative test cases', () => {
  [
    { 
      test_name: 'Incorrect username', 
      user_name: 'non_existing_user',
      password: 'secret_sauce',
      expected: 'Epic sadface: Username and password do not match any user in this service' 
    },
    { 
      test_name: 'Locked out user', 
      user_name: 'locked_out_user',
      password: 'secret_sauce',
      expected: 'Epic sadface: Sorry, this user has been locked out.' 
    },
    { 
      test_name: 'Incorrect password', 
      user_name: 'standard_user',
      password: 'incorrect_password',
      expected: 'Epic sadface: Username and password do not match any user in this service' 
    },
  ].forEach(({ test_name, user_name, password, expected }) => {
    test(test_name, async ({ page }) => {
      await page.goto('https://www.saucedemo.com/')
      const loginButton = page.getByRole('button', { name: 'Login'})
      await expect(loginButton).toBeVisible()

      await page.fill('#user-name', user_name!)
      await page.fill('#password', password!)
      await loginButton.click()
      
      await expect(page.getByText(expected))
              .toBeVisible()
    })
  })
})
