/** @jsxImportSource @emotion/react */
import React from "react";
import styled from "@emotion/styled";
import tw from "twin.macro";
import { CHORDS } from "jmusic-engine";

import { Menu, Transition } from "@headlessui/react";

const ChordSelectorContainer = tw.div`absolute overflow-y-scroll max-h-96 left-0 w-48 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none`;
const ChordPillBase = tw.button`w-full py-1 px-3 text-xs text-gray-600`;
const ChordPill = styled(ChordPillBase)<{ selected?: boolean }>(
  ({ selected }) => [selected && tw`bg-gray-800 text-gray-200 rounded-l-md`]
);

const MenuButton = styled(Menu.Button)(
  tw`inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 active:bg-gray-50 active:text-gray-800`
);

const ChordSelector: React.FC<{
  index?: number;
  onChange?: (index: number) => void;
}> = ({ onChange, index = null }) => (
  <Menu>
    {({ open }) => (
      <>
        <span className="rounded-md shadow-sm">
          <MenuButton >
            <span>{index ? CHORDS[index].name : "Chords"}</span>
          </MenuButton>
        </span>
        <Transition
          show={open}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <ChordSelectorContainer >
            {CHORDS.map(({ name }, cIndex) => (
              <ChordPill
              
                key={cIndex}
                selected={cIndex === index}
                onClick={() => onChange?.(cIndex)}
              >
                {name}
              </ChordPill>
            ))}
          </ChordSelectorContainer>
        </Transition>
      </>
    )}
  </Menu>
);

export default ChordSelector;
