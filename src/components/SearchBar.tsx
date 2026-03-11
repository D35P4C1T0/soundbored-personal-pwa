import { memo } from 'react';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
  readonly value: string;
  onChange: (value: string) => void;
  readonly placeholder?: string;
}

export const SearchBar = memo(function SearchBar({
  value,
  onChange,
  placeholder = 'Search sounds...',
}: SearchBarProps) {
  return (
    <InputGroup size="lg">
      <InputLeftElement pointerEvents="none">
        <FaSearch color="gray.400" />
      </InputLeftElement>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search sounds"
        border="none"
        bg="gray.700"
        color="white"
        _placeholder={{ color: 'gray.400' }}
        _focus={{ bg: 'gray.600', boxShadow: 'outline' }}
      />
    </InputGroup>
  );
});
