'use client';

import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  ChangeEvent,
  ReactNode,
  ReactNodeArray,
  useImperativeHandle,
  forwardRef,
  useLayoutEffect,
} from 'react';
import TerminalInput from './linetypes/TerminalInput';
import TerminalOutput from './linetypes/TerminalOutput';
import './style.css';
import localFont from 'next/font/local';

const GeistMono = localFont({ src: './GeistMonoVariableVF.woff2' });

export interface Props {
  name?: string;
  prompt?: string;
  height?: string;
  children?: ReactNode;
  onInput?: ((input: string) => void) | null | undefined;
  onClear: () => void;
}

const Terminal = forwardRef(function TerminalComponent(
  { name, prompt, height = '600px', onInput, onClear, children }: Props,
  ref
) {
  const [currentLineInput, setCurrentLineInput] = useState('');
  const [cursorPos, setCursorPos] = useState(0);

  const scrollIntoViewRef = useRef<HTMLDivElement>(null);

  const updateCurrentLineInput = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentLineInput(event.target.value);
  };

  // Calculates the total width in pixels of the characters to the right of the cursor.
  // Create a temporary span element to measure the width of the characters.
  const calculateInputWidth = (
    inputElement: HTMLInputElement,
    chars: string
  ) => {
    const span = document.createElement('span');
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.style.fontSize = window.getComputedStyle(inputElement).fontSize;
    span.style.fontFamily = window.getComputedStyle(inputElement).fontFamily;
    span.innerText = chars;
    document.body.appendChild(span);
    const width = span.getBoundingClientRect().width;
    document.body.removeChild(span);
    // Return the negative width, since the cursor position is to the left of the input suffix
    return -width;
  };

  const clamp = (value: number, min: number, max: number) => {
    if (value > max) return max;
    if (value < min) return min;
    return value;
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!onInput) {
      return;
    }
    if (event.key === 'Enter') {
      onInput(currentLineInput);
      setCursorPos(0);
      setCurrentLineInput('');
      // setTimeout(
      //   () =>
      //     scrollIntoViewRef?.current?.scrollIntoView({
      //       behavior: 'auto',
      //       block: 'nearest',
      //     }),
      //   500
      // );
      console.log('Reached here');
    } else if (
      ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Delete'].includes(
        event.key
      )
    ) {
      const inputElement = event.currentTarget;
      let charsToRightOfCursor = '';
      let cursorIndex =
        currentLineInput.length - (inputElement.selectionStart || 0);
      cursorIndex = clamp(cursorIndex, 0, currentLineInput.length);

      if (event.key === 'ArrowLeft') {
        if (cursorIndex > currentLineInput.length - 1) cursorIndex--;
        charsToRightOfCursor = currentLineInput.slice(
          currentLineInput.length - 1 - cursorIndex
        );
      } else if (event.key === 'ArrowRight' || event.key === 'Delete') {
        charsToRightOfCursor = currentLineInput.slice(
          currentLineInput.length - cursorIndex + 1
        );
      } else if (event.key === 'ArrowUp') {
        charsToRightOfCursor = currentLineInput.slice(0);
      }

      const inputWidth = calculateInputWidth(
        inputElement,
        charsToRightOfCursor
      );
      setCursorPos(inputWidth);
    }
  };

  const [displayedOutputs, setDisplayedOutputs] = useState<ReactNode[]>([]);

  const outputKey = useRef<number>(0);

  useEffect(() => {
    if (!Array.isArray(children) || children.length === 0) {
      return;
    }

    const displayChildren = async () => {
      for (let i = 0; i < children.length; i++) {
        // Wait for the next frame to update
        await new Promise(resolve => requestAnimationFrame(resolve));
        console.log(outputKey.current);
        setDisplayedOutputs(prevOutputs => {
          const newChild = React.cloneElement(children[i], {
            key: `child-${outputKey.current++}`,
          });
          const arr = prevOutputs.concat(newChild).slice(-50);
          if (prevOutputs.length >= 50) {
            return [prevOutputs[0]].concat(arr);
          } else {
            return arr;
          }
        });

        scrollIntoViewRef?.current?.scrollIntoView({
          behavior: 'instant',
          block: 'end',
        });
      }
    };

    displayChildren();
  }, [children]);

  useLayoutEffect(() => {
    if (scrollIntoViewRef.current) {
      scrollIntoViewRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [displayedOutputs]); // Depend on lineData, assuming it's updated in displayChildren

  const clearOutput = () => {
    // keep welcome terminal
    setDisplayedOutputs(prev => prev.slice(0, 1));
    onClear();
  };

  useImperativeHandle(ref, () => ({
    clearOutput,
  }));

  // We use a hidden input to capture terminal input; make sure the hidden input is focused when clicking anywhere on the terminal
  //   useEffect(() => {
  //     if (onInput == null || !wrapperRef.current) {
  //       return;
  //     }

  //     const handleWrapperClick = () => {
  //       const hiddenInput = wrapperRef.current.querySelector(
  //         '.terminal-hidden-input'
  //       ) as HTMLElement;
  //       hiddenInput?.focus();
  //     };

  //     const wrapperElement = wrapperRef.current;
  //     wrapperElement.addEventListener('click', handleWrapperClick);

  //     return function cleanup() {
  //       wrapperElement.removeEventListener('click', handleWrapperClick);
  //     };
  //   }, [onInput]);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const handleWrapperClick = () => {
    console.log('wrapper clicked');
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  };

  return (
    <div
      ref={wrapperRef}
      onClick={handleWrapperClick}
      className={`react-terminal-wrapper bg-[#101010] ${GeistMono.className} w-full`}
      data-terminal-name={name}
    >
      {/* Terminal Output Section */}
      <div
        className={`react-terminal-output border h-[calc(100vh-240px)] md:h-[${height}] border-zinc-900 p-6 text-sm overflow-hidden overflow-y-scroll pb-10 text-[#aaaaaa] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900`}
        // style={{ height }}
      >
        {displayedOutputs}
        <div className="h-[30px]" ref={scrollIntoViewRef}></div>
      </div>

      {/* Terminal Input Section */}
      <div className="border border-zinc-900 p-4">
        <div
          className="react-terminal-line react-terminal-input react-terminal-active-input"
          data-terminal-prompt={prompt}
          key="terminal-line-prompt"
        >
          {currentLineInput}
          <span
            className="cursor"
            style={{ left: `${cursorPos + 1}px` }}
          ></span>
        </div>
        <input
          ref={hiddenInputRef}
          className="terminal-hidden-input"
          placeholder=""
          value={currentLineInput}
          autoFocus={onInput != null}
          onChange={updateCurrentLineInput}
          onKeyDown={handleInputKeyDown}
        />
      </div>
    </div>
  );
});

export { TerminalInput, TerminalOutput };
export default Terminal;
