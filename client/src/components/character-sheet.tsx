import { Props as AttributesProps } from './attributes/types';
import { Character } from '../types';
import { Tab, Tabs } from '@blueprintjs/core';
import { selectEditingCharacter } from '../data/edit-mode-slice';
import Attributes from './attributes';
import CharacterHeader from './character-header';
import CharacterMenu from './character-menu';
import Extras from './extras';
import PowerNotes from './power-notes';
import SkillCheck from './skill-check';
import { useSelector } from 'react-redux';
import CharacterBackground from './character-background';
import { PrepareRoll } from './prepare-roll/prepare-roll';

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

const CharacterSheet = ({ character: characterProp }: Props) => {
    const characterToEdit = useSelector(selectEditingCharacter);
    const character = characterToEdit || characterProp;
    return (
        <>
            <div className="character-sheet">
                <CharacterMenu character={character} />
                {!characterToEdit && (
                    <CharacterHeader
                        avatar={character.avatar}
                        codeName={character.codeName}
                        motivation={character.motivation}
                        name={character.name}
                        origin={character.origin}
                        player={character.player}
                    />
                )}
                <Tabs className="character-sheet-sections" large>
                    {characterToEdit && (
                        <Tab
                            id="character-core"
                            title="Character"
                            panel={
                                <CharacterHeader
                                    avatar={character.avatar}
                                    codeName={character.codeName}
                                    motivation={character.motivation}
                                    name={character.name}
                                    origin={character.origin}
                                    player={character.player}
                                />
                            }
                        />
                    )}
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
                    <Tab
                        id="character-background"
                        title="Background"
                        panel={<CharacterBackground background={character.background} />}
                    />
                </Tabs>
                <div className="controls footer">
                    <SkillCheck />
                </div>
                {characterToEdit && <CharacterMenu character={character} />}
            </div>
        </>
    );
};

export default CharacterSheet;
