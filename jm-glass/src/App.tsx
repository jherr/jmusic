/** @jsxImportSource @emotion/react */
import React from "react";
import tw from "twin.macro";
import styled from "@emotion/styled";
import { CHORDS, StringedInstrument } from "jmusic-engine";

import "tailwindcss/dist/base.min.css";
import "./App.css";

import ChordSelector from "./components/ChordSelector";
import NoteSelector from "./components/NoteSelector";
import Chord from "./components/Chord";

const guitar = StringedInstrument.guitar;

const Container = tw.div`max-w-7xl mx-auto p-5 mt-5`;
const LargeCard = tw.div`rounded-3xl`;

const Sidebar = tw.div`rounded-3xl rounded-r-none p-5 bg-white bg-opacity-90`;
const Content = tw.div`p-5`;
const TopBar = tw.div`rounded-tr-3xl p-5 bg-white bg-opacity-90`;

const ChordsContainer = tw.div`grid grid-cols-6 gap-2`;

const PagesBar = tw.div`w-8/12 text-right`;
const PagesContainer = tw.div`p-3`;
const PageBase = tw.button`py-2 px-4 inline-block text-gray-600 text-center`;
const Page = styled(PageBase)<{ selected?: boolean }>(({ selected }) => [
  selected && tw`bg-gray-800 text-gray-200 rounded-full`,
]);

interface SimplifiedChord {
  notes: number[];
  playability: number;
  inversion: number;
}

function App() {
  const [state, stateSet] = React.useState<{
    note: number;
    chord: number;
  }>({ note: 4, chord: 0 });
  const [groups, groupsSet] = React.useState<SimplifiedChord[][]>([]);
  const [group, groupSet] = React.useState<number>(0);

  React.useEffect(() => {
    const getChords = async () => {
      const req = await fetch(
        `http://localhost:8080/guitar_Guitar Standard_${
          CHORDS[state.chord].name
        }_${state.note}.json`
      );
      const resp = await req.json();
      const newChords: SimplifiedChord[] = resp.chords;
      groupSet(0);
      const newGroups = [];
      while (newChords.length > 0) {
        newGroups.push(newChords.splice(0, 12));
      }
      groupsSet(newGroups);
    };
    getChords();
  }, [state]);

  return (
    <Container>
      <LargeCard className="large-card">
        <Sidebar>
          <ChordSelector
            index={state.chord}
            onChange={(chord) =>
              stateSet({
                ...state,
                chord,
              })
            }
          />
        </Sidebar>
        <div>
          <TopBar>
            <NoteSelector
              note={state.note}
              onChange={(note) =>
                stateSet({
                  ...state,
                  note,
                })
              }
            />
          </TopBar>
          <Content>
            <ChordsContainer>
              {(groups?.[group] || []).map((chord, index) => (
                <Chord key={index} chord={chord} instrument={guitar} />
              ))}
            </ChordsContainer>
            <PagesBar>
              <PagesContainer>
                {groups.map((_, index) => (
                  <Page
                    selected={group === index}
                    onClick={() => groupSet(index)}
                  >
                    {index + 1}
                  </Page>
                ))}
              </PagesContainer>
            </PagesBar>
          </Content>
        </div>
      </LargeCard>
    </Container>
  );
}

export default App;
