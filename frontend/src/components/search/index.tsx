'use client';

import * as React from 'react';

import {
  Command,
  CommandDialog,
  CommandLoading,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';

import Image from 'next/image';
import axios from 'axios';
import Link from 'next/link';
import { formatCurrency } from '@/utils/format-currency';

type Props = {};

const Search = (props: Props) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const [query, setQuery] = React.useState('');
  const [queryHistory, setQueryHistory] = React.useState<any>([]);
  const [debounceTimeout, setDebounceTimeout] =
    React.useState<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    if (!query || query.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const newTimeout = setTimeout(async () => {
      setLoading(true);
      const existingEntry = queryHistory.find(
        (entry: any) => entry.query === query
      );

      if (existingEntry) {
        setResults(existingEntry.results);
        setLoading(false);
      } else {
        try {
          const res = await axios.get(`/api/search/?query=${query}`);
          setResults(res.data);
          // Update query history
          const newEntry = { query, results: res.data };
          const updatedHistory = [newEntry, ...queryHistory.slice(0, 9)];
          setQueryHistory(updatedHistory);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }
    }, 200);

    setDebounceTimeout(newTimeout);

    return () => clearTimeout(newTimeout);
  }, [query]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleClick = () => {
    setOpen(open => !open);
  };

  return (
    <>
      <div
        className="flex bg-zinc-900 border border-zinc-800 py-2 max-md:px-2 md:pl-2 md:pr-4 gap-2 md:min-w-[400px] w-fit"
        onClick={handleClick}
      >
        <Image src="/icons/search.svg" alt="token" width={28} height={28} />
        <input
          type="text"
          autoComplete="off"
          placeholder="Search or type a command"
          className="w-[80%] max-md:hidden text-[14px] text-white placeholder:text-neutral-600 border-none outline-none bg-transparent"
        />
        <div className="flex gap-1 px-2 max-md:hidden py-1 bg-black rounded-md">
          <p className="text-white">⌘</p>
          <p className="text-white">K</p>
        </div>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput
            placeholder="Type a command or search..."
            value={query}
            onValueChange={setQuery}
            loading={loading}
          />
          <CommandList>
            {query.length > 0 && (
              <CommandEmpty>
                {query.length <= 2
                  ? 'Please enter more than 2 characters.'
                  : !loading && results.length === 0
                  ? 'No results found'
                  : ''}
              </CommandEmpty>
            )}

            {query.length > 2 && (
              <CommandGroup heading="Search">
                {results.map((item: any) => {
                  return (
                    <Link
                      href={`/analytics/${item?.baseToken.address}`}
                      key={`${item?.pairAddress}`}
                      onClick={() => setOpen(false)}
                    >
                      <CommandItem
                        value={item.baseToken.name}
                        className="cursor-pointer justify-between"
                      >
                        <span>{item.baseToken.name}</span>
                        <span>${item.priceUsd}</span>
                      </CommandItem>
                    </Link>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
          <CommandList>
            <CommandGroup heading="Overview">
              <CommandItem>
                <Image
                  alt="dashboard"
                  src={`/icons/nav/dashboard.svg`}
                  width={18}
                  height={18}
                  style={{
                    filter: 'invert(100%) brightness(150%) contrast(100%)',
                  }}
                  className="mr-2"
                />
                <span>Dashboard</span>
              </CommandItem>
              <CommandItem>
                <Image
                  alt="analytics"
                  src={`/icons/nav/live-monitoring.svg`}
                  width={18}
                  height={18}
                  style={{
                    filter: 'invert(100%) brightness(150%) contrast(100%)',
                  }}
                  className="mr-2"
                />
                <span>Analytics</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Audit">
              <CommandItem>
                <Image
                  alt="analytics"
                  src={`/icons/nav/code-audit.svg`}
                  width={18}
                  height={18}
                  style={{
                    filter: 'invert(100%) brightness(150%) contrast(100%)',
                  }}
                  className="mr-2"
                />
                <span>Code</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Image
                  alt="analytics"
                  src={`/icons/nav/token-audit.svg`}
                  width={18}
                  height={18}
                  style={{
                    filter: 'invert(100%) brightness(150%) contrast(100%)',
                  }}
                  className="mr-2"
                />
                <span>Audit</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Leaderboards">
              <CommandItem>
                <Image
                  alt="analytics"
                  src={`/icons/nav/trending.svg`}
                  width={18}
                  height={18}
                  style={{
                    filter: 'invert(100%) brightness(150%) contrast(100%)',
                  }}
                  className="mr-2"
                />
                <span>Trending</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Image
                  alt="analytics"
                  src={`/icons/nav/security.svg`}
                  width={18}
                  height={18}
                  style={{
                    filter: 'invert(100%) brightness(150%) contrast(100%)',
                  }}
                  className="mr-2"
                />
                <span>Security Scores</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Image
                  alt="analytics"
                  src={`/icons/nav/bug-bounty.svg`}
                  width={18}
                  height={18}
                  style={{
                    filter: 'invert(100%) brightness(150%) contrast(100%)',
                  }}
                  className="mr-2"
                />
                <span>Bug Bounty</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
};

export default Search;
