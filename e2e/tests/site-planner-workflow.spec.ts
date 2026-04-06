import { test, expect } from '@playwright/test';

test.describe('Tesla Energy Site Planner Workflow', () => {
  const testUser = {
    username: `testuser_${Date.now()}`,
    password: 'Password123!',
    name: 'Test Engineer'
  };

test('Full User Journey: Sign Up, Design Site, and Persist State', async ({ page }) => {
    test.setTimeout(60000); // Increase timeout for the industrial dashboard load
    
    // 1. Navigate to landing page
    await page.goto('/');
    
    // 2. Sign Up
    await page.getByText('Create an account').click();
    await page.getByTestId('signup-fullname').fill(testUser.name);
    await page.getByTestId('signup-username').fill(testUser.username);
    await page.getByTestId('signup-password').fill(testUser.password);
    await page.getByTestId('signup-submit').click();
    
    // 3. Log In
    await expect(page.getByText('User created successfully')).toBeVisible();
    await page.getByTestId('login-username').fill(testUser.username);
    await page.getByTestId('login-password').fill(testUser.password);
    await page.getByTestId('login-submit').click();

    // 4. Verify Dashboard Welcome
    await expect(page.locator('h2')).toContainText(testUser.name);

    // 5. Interact with Site Planner Sidebar - Add 2 Megapack XLs & 10 Powerpacks
    await page.getByTestId('device-input-megapackxl').fill('2');
    await page.getByTestId('device-input-powerpack').fill('10');
    
    // 6. Verify Statistics Update
    // 2 XL Megapacks ($240k) + 10 Powerpacks ($100k) + 6 Transformers ($60k) = $400,000
    // Energy: (2 * 4) + (10 * 1) - (6 * 0.5) = 15 MWh
    await expect(page.getByText('$400,000')).toBeVisible();
    await expect(page.getByText('15 MWh')).toBeVisible();

    // 7. Toggle to 3D View and Verify Canvas
    await page.getByText('3D VIEW').click();
    await expect(page.locator('canvas')).toBeVisible();

    // 8. Save Layout
    const dialogPromise = page.waitForEvent('dialog');
    await page.getByTestId('save-layout-btn').click();
    const dialog = await dialogPromise;
    expect(dialog.message()).toContain('Site layout saved successfully');
    await dialog.accept();

    // 10. Reload and Verify Persistence
    await page.reload();
    await expect(page.getByTestId('device-input-megapackxl')).toHaveValue('2');
    await expect(page.getByTestId('device-input-powerpack')).toHaveValue('10');
  });
});

