import { writable } from 'svelte/store';
import { Animations, Density, TextSize, TextWeight, Theme } from '../lib/enums';
import { getStorageItem, setStorageItem, StorageKey } from '../lib/utils/storage';
import type { Settings } from '../models';

const defaultSettings: Settings = {
  theme: Theme.Light,
  accentColor: '#707C99',
  cardAccentColor: '#707C99',
  textSize: TextSize.Medium,
  textWeight: TextWeight.Medium,
  displayDensity: Density.Normal,
  borderRadius: 14,
  animations: Animations.Normal,
  showHintText: true,
};

const storedSettings = getStorageItem<Settings>(StorageKey.Settings);

function createSettings() {
  const { subscribe, update, set } = writable<Settings>({
    ...defaultSettings,
    ...storedSettings,
  });

  subscribe((val) => {
    setStorageItem(StorageKey.Settings, val);
  });

  return {
    subscribe,
    update: function <T extends keyof Settings>(key: T, value: Settings[T]) {
      update((previous) => ({ ...previous, [key]: value }));
    },
  };
}

export const settings = createSettings();
