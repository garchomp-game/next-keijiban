import { test, expect, Browser } from '@playwright/test';

test('signup login room creation and realtime messaging', async ({ browser }) => {
  const rand = Date.now();
  const user1 = {
    email: `user1-${rand}@example.com`,
    password: 'password123',
    displayName: 'User1',
  };
  const user2 = {
    email: `user2-${rand}@example.com`,
    password: 'password123',
    displayName: 'User2',
  };

  const context1 = await browser.newContext();
  const page1 = await context1.newPage();
  await page1.goto('/signup');
  await page1.fill('[data-testid="signup-email"]', user1.email);
  await page1.fill('[data-testid="signup-password"]', user1.password);
  await page1.fill('[data-testid="signup-displayName"]', user1.displayName);
  await page1.click('[data-testid="signup-submit"]');

  await page1.goto('/login');
  await page1.fill('[data-testid="login-email"]', user1.email);
  await page1.fill('[data-testid="login-password"]', user1.password);
  await page1.click('[data-testid="login-submit"]');
  // Wait for login to complete; adjust the URL/selector to match your app
  await page1.waitForURL(/\/rooms/);

  await page1.fill('[data-testid="create-room-input"]', 'test room');
  await page1.click('[data-testid="create-room-submit"]');
  const roomButton = page1.locator('[data-testid^="room-item-"]').last();
  await roomButton.waitFor({ state: 'visible' });
  const roomIdAttr = await roomButton.getAttribute('data-testid');
  if (!roomIdAttr) throw new Error('room id not found');
  const roomId = roomIdAttr.replace('room-item-', '');
  await roomButton.click();

  const context2 = await browser.newContext();
  const page2 = await context2.newPage();
  await page2.goto('/signup');
  await page2.fill('[data-testid="signup-email"]', user2.email);
  await page2.fill('[data-testid="signup-password"]', user2.password);
  await page2.fill('[data-testid="signup-displayName"]', user2.displayName);
  await page2.click('[data-testid="signup-submit"]');

  await page2.goto('/login');
  await page2.fill('[data-testid="login-email"]', user2.email);
  await page2.fill('[data-testid="login-password"]', user2.password);
  await page2.click('[data-testid="login-submit"]');
  // Wait for login to complete; adjust the URL/selector to match your app
  await page2.waitForURL(/\/rooms/);
  await page2.goto(`/rooms/${roomId}`);

  await page1.fill('[data-testid="message-input"]', 'hello from user1');
  await page1.click('[data-testid="message-submit"]');
  await expect(page1.locator('[data-testid="message-list"]')).toContainText('hello from user1');
  await expect(page2.locator('[data-testid="message-list"]')).toContainText('hello from user1');

  await page2.fill('[data-testid="message-input"]', 'hi from user2');
  await page2.click('[data-testid="message-submit"]');
  await expect(page1.locator('[data-testid="message-list"]')).toContainText('hi from user2');
  await expect(page2.locator('[data-testid="message-list"]')).toContainText('hi from user2');

  await context1.close();
  await context2.close();
});
