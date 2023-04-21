
/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { test, expect } from './npmTest';

for (const pkg of ['playwright-chromium', 'playwright-firefox', 'playwright-webkit']) {
  test(`${pkg} should work`, async ({ exec, nodeMajorVersion, installedSoftwareOnDisk }) => {
    const result = await exec('npm i --foreground-scripts', pkg);
    const browserName = pkg.split('-')[1];
    const expectedSoftware = [browserName];
    if (browserName === 'chromium')
      expectedSoftware.push('ffmpeg');
    expect(result).toHaveLoggedSoftwareDownload(expectedSoftware as any);
    expect(await installedSoftwareOnDisk()).toEqual(expectedSoftware);
    expect(result).not.toContain(`To avoid unexpected behavior, please install your dependencies first`);
    await exec('node sanity.js', pkg);
    if (nodeMajorVersion >= 14)
      await exec('node', `esm-${pkg}.mjs`);
  });
}
