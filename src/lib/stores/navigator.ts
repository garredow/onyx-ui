import { get, writable } from 'svelte/store';

type Group = {
  id: string;
  focusedItemId: string | null;
};

export const groups = writable<Group[]>([]);
export const activeGroup = writable<Group | null>(null);
export const activeGroupId = writable<string | null>(null);
export const groupItemMap = writable<{ [groupId: string]: string | null }>({});

groups.subscribe((data) => {
  activeGroup.set(data.at(-1) || null);
  activeGroupId.set(data.at(-1)?.id || null);
  groupItemMap.set(
    data.reduce((acc, val) => {
      acc[val.id] = val.focusedItemId;
      return acc;
    }, {} as any)
  );
});

export function getFocusedItemId(groupId: string): string | null {
  return get(groups).find((a) => a.id === groupId)?.focusedItemId || null;
}

export function setSelectedId(groupId: string, itemId?: string) {
  const data = get(groups).map((a) =>
    a.id === groupId ? { id: groupId, focusedItemId: itemId || null } : a
  );
  groups.set(data);
}

export function activateGroup(id: string) {
  const other = get(groups).filter((a) => a.id !== id);
  const newGroups = [...other, { id, focusedItemId: null }];
  groups.set(newGroups);
}

export function deactivateGroup(id: any) {
  const newGroups = get(groups).filter((a) => a.id !== id);
  groups.set(newGroups);
}

export function resetNavigation() {
  groups.set([]);
}
