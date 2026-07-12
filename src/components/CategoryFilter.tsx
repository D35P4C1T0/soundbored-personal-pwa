import { memo } from 'react';

interface CategoryFilterProps { readonly tags: readonly string[]; readonly selectedTags: readonly string[]; onToggleTag: (tag: string) => void }

export const CategoryFilter = memo(function CategoryFilter({ tags, selectedTags, onToggleTag }: CategoryFilterProps) {
  if (!tags.length) return null;
  return (
    <div className="filters" role="group" aria-label="Category filters">
      {tags.map((tag) => {
        const selected = selectedTags.includes(tag);
        return <button key={tag} className={selected ? 'selected' : ''} aria-pressed={selected} onClick={() => onToggleTag(tag)}>{tag}</button>;
      })}
    </div>
  );
});
