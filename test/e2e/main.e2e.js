/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */
import { ClientFunction } from 'testcafe';

const assertNoConsoleErrors = async (t) => {
  const { error } = await t.getBrowserConsoleMessages();
  await t.expect(error).eql([]);
};

fixture`Main Window`.page('../../app/app.html').afterEach(assertNoConsoleErrors);

test('The window title should be "Pixie"', async (t) => {
  const getPageTitle = ClientFunction(() => document.title);
  await t.expect(getPageTitle()).eql('Pixie');
});
