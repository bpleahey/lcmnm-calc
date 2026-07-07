'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { isOptionDivider } from '@/lib/learnset';

interface AutocompleteProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  /** Only commit values that exist in options. Invalid typed text reverts on blur. */
  strict?: boolean;
  /** Allow selecting empty string (e.g. no item). */
  allowEmpty?: boolean;
  /** Max dropdown height class. Shows all filtered options in a scrollable list. */
  listClassName?: string;
  /** Native title tooltip on the input (e.g. full move name when truncated). */
  title?: string;
}

export function Autocomplete({
  value,
  options,
  onChange,
  placeholder,
  className = '',
  inputClassName = '',
  strict = false,
  allowEmpty = false,
  listClassName = 'max-h-72',
  title,
}: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectableOptions = useMemo(
    () => options.filter((opt) => !isOptionDivider(opt)),
    [options],
  );
  const optionSet = useMemo(() => new Set(selectableOptions), [selectableOptions]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    if (!q) {
      if (allowEmpty) return ['', ...options];
      return options;
    }

    const matches = options.filter((opt) => {
      if (isOptionDivider(opt)) return false;
      return opt.toLowerCase().includes(q);
    });

    if (allowEmpty && ('none'.startsWith(q) || 'no item'.includes(q))) {
      return ['', ...matches];
    }

    return matches;
  }, [allowEmpty, options, searchQuery]);

  const openDropdown = () => {
    setSearchQuery('');
    setOpen(true);
  };

  const closeDropdown = () => {
    setOpen(false);
    setSearchQuery('');
  };

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [open]);

  const commit = (next: string) => {
    if (isOptionDivider(next)) return;
    if (strict && next && !optionSet.has(next)) return;
    if (strict && !next && !allowEmpty) return;
    onChange(next);
    closeDropdown();
  };

  const handleContainerBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;
    if (next && containerRef.current?.contains(next)) return;

    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        closeDropdown();
      }
    }, 150);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const firstSelectable = filtered.find((opt) => !isOptionDivider(opt));
      if (firstSelectable !== undefined) {
        event.preventDefault();
        commit(firstSelectable);
      }
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDropdown();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onBlur={handleContainerBlur}
    >
      <input
        type="text"
        readOnly
        value={value}
        placeholder={placeholder}
        title={title ?? (value || undefined)}
        onFocus={openDropdown}
        onClick={openDropdown}
        className={`input-field w-full cursor-pointer ${inputClassName}`}
      />
      {open && (
        <div className="autocomplete-dropdown absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-[rgba(201,162,39,0.3)] bg-panel shadow-lg">
          <div className="border-b border-[rgba(201,162,39,0.2)] p-1.5">
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="autocomplete-search input-field input-field-compact w-full"
            />
          </div>
          {filtered.length > 0 ? (
            <ul className={`overflow-y-auto ${listClassName}`}>
              {filtered.map((opt, index) => (
                <li key={isOptionDivider(opt) ? `divider-${index}` : opt || '__empty__'}>
                  {isOptionDivider(opt) ? (
                    <div className="my-1 border-t border-[rgba(201,162,39,0.25)]" role="separator" />
                  ) : (
                    <button
                      type="button"
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-rainbow/10 ${
                        opt === value ? 'text-gold-light' : ''
                      }`}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => commit(opt)}
                    >
                      {opt || '(none)'}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-2 text-xs text-gold-light">No matches</p>
          )}
        </div>
      )}
    </div>
  );
}
