/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import tw from "twin.macro";
import { SCALE_NOTES } from "jmusic-engine";

import "tailwindcss/dist/base.min.css";
import "./App.css";

const Container = tw.div`max-w-7xl mx-auto p-5 mt-5`;
const LargeCard = tw.div`rounded-3xl`;
const Heading = tw.div`text-gray-800`;
const Sidebar = tw.div`rounded-3xl rounded-r-none p-5 bg-white bg-opacity-90`;
const Content = tw.div`p-5`;
const TopBar = tw.div`rounded-tr-3xl p-5 bg-white bg-opacity-90`;

const SelectorContainer = tw.div`rounded-full bg-gray-300 grid grid-cols-12`;
const PillBase = tw.div`py-2 inline-block text-gray-600 text-center`;
const Pill = styled(PillBase)<{ selected?: boolean }>(({ selected }) => [
  selected && tw`bg-gray-800 text-gray-200 rounded-full`,
]);

const NoteSelector: React.FC<{
  note?: number;
}> = ({ note }) => (
  <SelectorContainer>
    {SCALE_NOTES.map((name, index) => (
      <Pill key={name} selected={note === index}>
        {name}
      </Pill>
    ))}
  </SelectorContainer>
);

function App() {
  return (
    <div>
      <Container>
        <LargeCard className="large-card">
          <Sidebar>
            <Heading>Sidebar</Heading>
          </Sidebar>
          <div>
            <TopBar>
              <NoteSelector />
            </TopBar>
            <Content>
              <Heading>Content</Heading>
            </Content>
          </div>
        </LargeCard>
      </Container>
    </div>
  );
}

export default App;
