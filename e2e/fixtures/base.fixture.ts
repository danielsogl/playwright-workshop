import { expect, mergeTests } from '@playwright/test';
import { authFixture } from './auth.fixture';
import { userFixture, UserOptions } from './user.fixture';
import { workerFixture } from './worker.fixture';

const test = mergeTests(authFixture, userFixture, workerFixture);

// export options from fixtures
export type FixtureOptions = UserOptions;
export { test, expect };
