'use client';

import * as React from 'react';
import {
  CalendarIcon,
  EnvelopeClosedIcon,
  FaceIcon,
  GearIcon,
  PersonIcon,
  RocketIcon,
} from '@radix-ui/react-icons';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';

import Image from 'next/image';

type Props = {};

const Search = (props: Props) => {
  const [open, setOpen] = React.useState(false);

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
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
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
              <span>Pen Testing</span>
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
      </CommandDialog>
    </>
  );
};

export default Search;
