export interface Sound {
  readonly id: number;
  readonly filename: string;
  readonly sourceType: 'local' | 'url' | string;
  readonly url: string | null;
  readonly volume: number | null;
  readonly description: string | null;
  readonly tags: readonly string[];
  readonly isJoinSound: boolean;
  readonly isLeaveSound: boolean;
  readonly insertedAt: string | null;
  readonly updatedAt: string | null;
}

export interface HistoryEntry {
  readonly id: number;
  readonly timestamp: number;
}

export interface LibraryStorageData {
  readonly favorites: readonly number[];
  readonly history: readonly HistoryEntry[];
}
