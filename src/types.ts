export interface Sound {
  id: number;
  filename: string;
  tags?: readonly string[];
}

export interface HistoryEntry {
  id: number;
  timestamp: number;
}

export interface Settings {
  gridColumns?: number;
  tileSize?: string;
}

export interface StorageData {
  favorites: number[];
  history: HistoryEntry[];
  settings: Settings;
}

