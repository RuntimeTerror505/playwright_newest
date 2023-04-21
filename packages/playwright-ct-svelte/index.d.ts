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

import type {
  TestType,
  PlaywrightTestArgs,
  PlaywrightTestConfig as BasePlaywrightTestConfig,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
  Locator,
} from '@playwright/test';
import type { JsonObject } from '@playwright/experimental-ct-core/types/component';
import type { InlineConfig } from 'vite';
import type { SvelteComponent, ComponentProps } from 'svelte/types/runtime';

export type PlaywrightTestConfig<T = {}, W = {}> = Omit<BasePlaywrightTestConfig<T, W>, 'use'> & {
  use?: BasePlaywrightTestConfig<T, W>['use'] & {
    ctPort?: number;
    ctTemplateDir?: string;
    ctCacheDir?: string;
    ctViteConfig?: InlineConfig | (() => Promise<InlineConfig>);
  };
};

type Slot = string | string[];

export interface MountOptions<
  HooksConfig extends JsonObject,
  Component extends SvelteComponent
> {
  props?: ComponentProps<Component>;
  slots?: Record<string, Slot> & { default?: Slot };
  on?: Record<string, Function>;
  hooksConfig?: HooksConfig;
}

interface MountResult<Component extends SvelteComponent> extends Locator {
  unmount(): Promise<void>;
  update(
    options: Omit<MountOptions<never, Component>, 'hooksConfig' | 'slots'>
  ): Promise<void>;
}

interface ComponentFixtures {
  mount<
    HooksConfig extends JsonObject,
    Component extends SvelteComponent = SvelteComponent
  >(
    component: new (...args: any[]) => Component,
    options?: MountOptions<HooksConfig, Component>
  ): Promise<MountResult<Component>>;
}

export const test: TestType<
  PlaywrightTestArgs & PlaywrightTestOptions & ComponentFixtures,
  PlaywrightWorkerArgs & PlaywrightWorkerOptions
>;

/**
 * Defines Playwright config
 */
export function defineConfig(config: PlaywrightTestConfig): PlaywrightTestConfig;
export function defineConfig<T>(config: PlaywrightTestConfig<T>): PlaywrightTestConfig<T>;
export function defineConfig<T, W>(config: PlaywrightTestConfig<T, W>): PlaywrightTestConfig<T, W>;

export { expect, devices } from '@playwright/test';
