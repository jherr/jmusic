/** @jsxImportSource @emotion/react */
import { Menu, Transition } from "@headlessui/react";
import { CHORDS } from "jmusic-engine";
import React from "react";
import { ChordPill, ChordSelectorContainer, MenuButton } from "@design/Theme";

const ChordSelector: React.FC<{
  index?: number;
  onChange?: (index: number) => void;
}> = ({ onChange, index = null }) => (
  <Menu>
    {({ open }) => (
      <>
        <MenuButton>
          <span>{index ? CHORDS[index].name : "Chords"}</span>
        </MenuButton>
        <Transition
          show={open}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <ChordSelectorContainer>
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
