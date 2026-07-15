import { expect, mergeTests } from '@playwright/test';
import { authFixture } from './auth.fixture';
import { userFixture, UserOptions } from './user.fixture';
import { workerFixture } from './worker.fixture';
import { multiAuthFixture } from './multi-auth.fixture';
import { userManagementFixture } from '@/e2e/fixtures/user-management.fixture';
import { pagesFixture } from '@/e2e/fixtures/pages.fixture';
import { postFixture } from '@/e2e/fixtures/post.fixture';

const test = mergeTests(authFixture, userFixture, workerFixture, multiAuthFixture, userManagementFixture, pagesFixture, postFixture);

// export options from fixtures
export type FixtureOptions = UserOptions;
export { test, expect };
