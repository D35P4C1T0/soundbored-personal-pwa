import { memo } from 'react';

interface SearchBarProps {
  readonly value: string;
  onChange: (value: string) => void;
}

export const SearchBar = memo(function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="search">
      <span aria-hidden="true">⌕</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={'Search sounds or tags… Try "exact"'}
        aria-label="Search sounds"
        type="search"
        autoComplete="off"
      />
    </label>
  );
});
