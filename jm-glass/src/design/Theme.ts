import styled from "@emotion/styled";
import { Menu } from "@headlessui/react";
import tw from "twin.macro";

/** Main Layout */
export const MainContainer = tw.div`container mx-auto flex px-5 py-24 flex-col`;
export const Logo = tw.div`text-black items-center font-medium flex mb-4 md:mb-0 w-full md:w-3/12 relative`;
export const Header = tw.header`text-gray-700 my-3 `;
export const HeaderContainer = tw.div`container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center bg-blue-100 rounded `;

export const ContentContainer = tw.div`grid grid-rows-3 md:grid-rows-3 sm:grid-flow-row md:grid-flow-col gap-4`;

/** Chord Selector */
export const ChordSelectorContainer = tw.div`z-50 absolute overflow-y-scroll h-screen left-0 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none`;
export const ChordPillBase = tw.button`w-full py-1 px-3 text-xs text-gray-600`;
export const ChordPill = styled(ChordPillBase)<{ selected?: boolean }>(
  ({ selected }) => [selected && tw`bg-gray-800 text-gray-200 rounded-l-md`]
);

export const MenuButton = styled(Menu.Button)(
  tw`focus:outline-none focus:border-blue-300 active:bg-gray-50 active:text-gray-800
  bg-white border border-gray-300 rounded-md hover:text-gray-500
  justify-center inline-flex rounded-md shadow-sm w-max
  text-gray-700 transition duration-150 ease-in-out
  w-full px-4 py-2 text-sm font-medium leading-5
  `
);

/** Note Selector */
export const NoteSelectorContainer = tw.div`flex flex-wrap items-center text-base justify-center md:block md:w-9/12 w-full px-2`;
export const PillBase = tw.button`rounded-lg cursor-pointer hover:bg-gray-500 hover:text-gray-100 inline-block text-gray-600 text-center w-1/12 max-w-md`;
export const Pill = styled(PillBase)<{ selected?: boolean }>(({ selected }) => [
  selected && tw`bg-gray-800 text-gray-200 rounded-full`,
]);

/** Chord */
export const Container = tw.div`bg-gray-200 bg-opacity-40 rounded-md`;
export const Inversion = tw.div`bg-white bg-opacity-40 rounded-b-md text-xs p-2 text-blue-700 text-center text-lg subpixel-antialiased`;

/** Pagination */
export const PagesBar = tw.div`w-full text-center`;
export const PagesContainer = tw.div`p-3 bg-blue-100 my-3`;
export const PageBase = tw.button`py-2 px-4 inline-block text-gray-600 text-center`;
export const Page = styled(PageBase)<{ selected?: boolean }>(({ selected }) => [
  selected && tw`bg-gray-800 text-gray-200 rounded-full`,
]);
