/** @jsxImportSource @emotion/react */
import React from 'react';
import { CHORDS, StringedInstrument } from 'jmusic-engine';
import { Chord, ChordSelector, NoteSelector } from './components';
import {
  ChordContainer,
  Header,
  HeaderContainer,
  Logo,
  Page,
  PagesBar,
  PagesContainer,
} from '@design/Theme';

const CACHE_HOST = '/jmusic/cache';
const guitar = StringedInstrument.guitar;

interface SimplifiedChord {
  notes: number[];
  playability: number;
  inversion: number;
}

function ChordPage() {
  const [state, stateSet] = React.useState<{
    note: number;
    chord: number;
  }>({ note: 4, chord: 0 });
  const [groups, groupsSet] = React.useState<SimplifiedChord[][]>([]);
  const [group, groupSet] = React.useState<number>(0);

  React.useEffect(() => {
    const getChords = async () => {
      const req = await fetch(
        `${CACHE_HOST}/guitar_Guitar Standard_${CHORDS[state.chord].name}_${
          state.note
        }.json`
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
    <>
      <Header>
        <HeaderContainer>
          <Logo>
            <ChordSelector
              index={state.chord}
              onChange={(chord) =>
                stateSet({
                  ...state,
                  chord,
                })
              }
            />
          </Logo>
          <NoteSelector
            note={state.note}
            onChange={(note) =>
              stateSet({
                ...state,
                note,
              })
            }
          />
        </HeaderContainer>
      </Header>
      <ChordContainer>
        {(groups?.[group] || []).map((chord, index) => (
          <Chord key={index} chord={chord} instrument={guitar} />
        ))}
      </ChordContainer>
      <PagesBar>
        <PagesContainer>
          {groups.map((_, index) => (
            <Page
              key={index}
              selected={group === index}
              onClick={() => groupSet(index)}
            >
              {index + 1}
            </Page>
          ))}
        </PagesContainer>
      </PagesBar>
    </>
  );
}

export default ChordPage;
