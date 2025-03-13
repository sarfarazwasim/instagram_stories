import { test, expect } from '@playwright/test';

test.describe("Home", () => {
  test.beforeEach(async ({page}) => {
    await page.setViewportSize({ width: 390, height: 600 });
    await page.goto('http://localhost:3000/');
  })
  test('has title and heading', async ({ page }) => {
    await expect(page).toHaveTitle('Instagram Stories');
    await expect(page.locator('.home-header')).toBeVisible();
  });
  
  test('has story list', async ({ page }) => {
    await expect(page.getByTestId("story-list-items")).toBeVisible();
    await expect(page.getByTestId("list-item")).toHaveCount(7);
    await page.getByTestId("list-item").nth(1).click()
  });
  
  test('story is loaded', async ({ page }) => {
    await page.route('https://picsum.photos/v2/list?page=1&limit=1', async route => {
      const response = await route.fetch();
      const json = await response.json();
      await route.fulfill({ json });
    });
    await page.getByTestId("list-item").nth(0).click();
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('close-icon')).toBeInViewport();
  });
  
  test('navigate to next and prev story', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.route('https://picsum.photos/v2/list?page=5&limit=5', async route => {
      const response = await route.fetch();
      const json = await response.json();
      await route.fulfill({ json });
    });
    await page.getByTestId("list-item").nth(4).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(6000)
    await expect(page.locator('.stepper .active')).toHaveCount(1)
    await page.waitForTimeout(6000)
    await expect(page.locator('.stepper .active')).toHaveCount(2)
    await page.mouse.click(12, 300);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.stepper .active')).toHaveCount(1)
  });
  
  test('go to prev profile', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.route('https://picsum.photos/v2/list?page=2&limit=2', async route => {
      const response = await route.fetch();
      const json = await response.json();
      await route.fulfill({ json });
    });
    await page.getByTestId("list-item").nth(1).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000)
    await page.mouse.click(12, 300);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000)
    await expect(page.locator('.stepper')).toHaveCount(1)
  });
  
  test('go to next profile', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.route('https://picsum.photos/v2/list?page=1&limit=1', async route => {
      const response = await route.fetch();
      const json = await response.json();
      await route.fulfill({ json });
    });
    await page.route('https://picsum.photos/v2/list?page=2&limit=2', async route => {
      const response = await route.fetch();
      const json = await response.json();
      await route.fulfill({ json });
    });
    await page.getByTestId("list-item").nth(0).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000)
    await page.mouse.click(500, 300);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000)
    await expect(page.locator('.stepper')).toHaveCount(2)
  });
  
  test('close story view', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.route('https://picsum.photos/v2/list?page=1&limit=1', async route => {
      const response = await route.fetch();
      const json = await response.json();
      await route.fulfill({ json });
    });
    await page.getByTestId("list-item").nth(0).click();
    await page.waitForLoadState('networkidle');
    await page.locator('.close-icon').click();
    await expect(page.locator('.story-list__modal')).toHaveCSS('opacity', '0')
  });
  
})