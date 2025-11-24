import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import { memo } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = memo(({
  value,
  onChange,
  placeholder = 'Search sounds...',
}) => {
  return (
    <InputGroup size="lg">
      <InputLeftElement pointerEvents="none">
        <FaSearch color="gray.400" />
      </InputLeftElement>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        bg="gray.700"
        border="none"
        color="white"
        aria-label="Search sounds"
        _placeholder={{ color: 'gray.400' }}
        _focus={{
          bg: 'gray.600',
          boxShadow: 'outline',
        }}
      />
    </InputGroup>
  );
});

SearchBar.displayName = 'SearchBar';

