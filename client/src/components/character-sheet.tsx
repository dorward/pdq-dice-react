import { Props as AttributesProps } from './attributes/types';
import { Character } from '../types';
import { Tab, TabId, Tabs } from '@blueprintjs/core';
import { selectEditingCharacter } from '../data/edit-mode-slice';
import Attributes from './attributes';
import CharacterInfo from './character-info';
import CharacterMenu from './character-menu';
import Extras from './extras';
import PowerNotes from './power-notes';
import SkillCheck from './skill-check';
import { useSelector } from 'react-redux';
import { PrepareRoll } from './prepare-roll/prepare-roll';
import { useCallback, useEffect, useState } from 'react';
import { Bennies } from './bennies/bennies-view';

type Props = {
    character: Character;
};

const qualities = {
    title: 'Standard Qualities',
    dataSource: 'qualities' as AttributesProps['dataSource'],
    isWoundable: true,
};

const powers = {
    title: 'Powers',
    dataSource: 'powers' as AttributesProps['dataSource'],
    isWoundable: false,
};

const viewOnlyTabs: TabId[] = ['prepare-roll', 'power-notes'];

const CharacterSheet = ({ character: characterProp }: Props) => {
    const characterToEdit = useSelector(selectEditingCharacter);
    const character = characterToEdit || characterProp;
    const [selectedTabId, setSelectedTabId] = useState<TabId>('character-core');

    const onChange = useCallback((newTabId: TabId) => {
        setSelectedTabId(newTabId);
    }, []);

    useEffect(() => {
        setSelectedTabId((prev) => {
            if (viewOnlyTabs.includes(prev) && characterToEdit) {
                return 'character-core';
            }
        });
    }, [!!characterToEdit]);

    return (
        <>
            <div className="character-sheet">
                <CharacterMenu character={character} />
                <Tabs
                    className="character-sheet-sections"
                    size="large"
                    selectedTabId={selectedTabId}
                    onChange={onChange}
                >
                    <Tab
                        id="character-core"
                        title="Character"
                        panel={
                            <CharacterInfo
                                avatar={character.avatar}
                                codeName={character.codeName}
                                motivation={character.motivation}
                                name={character.name}
                                origin={character.origin}
                                player={character.player}
                                background={character.background}
                            />
                        }
                    />
                    <Tab id="bennies" title="Bennies" panel={<Bennies />} />
                    {!characterToEdit && (
                        <Tab
                            id="prepare-roll"
                            title="Prepare Roll"
                            panel={<PrepareRoll character={character} />}
                        />
                    )}
                    <Tab
                        id="attributes"
                        title="Attributes"
                        panel={<Attributes {...{ ...qualities, character }} />}
                    />
                    <Tab
                        id="powers"
                        title="Powers"
                        panel={<Attributes {...{ ...powers, character }} />}
                    />
                    <Tab id="extras" title="Extras" panel={<Extras />} />
                    {!characterToEdit && (
                        <Tab
                            id="power-notes"
                            title="Power Notes"
                            panel={!characterToEdit && <PowerNotes powers={character.powers} />}
                        />
                    )}
                </Tabs>
                <div className="controls footer">
                    {!characterToEdit && <SkillCheck />}
                    {characterToEdit && <CharacterMenu character={character} />}
                </div>
            </div>
        </>
    );
};

export default CharacterSheet;
