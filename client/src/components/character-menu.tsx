import { editCharacter, selectEditingCharacter } from '../data/edit-mode-slice';
import { finishEditing } from '../data/helpers';
import { deleteCharacter } from '../data/user-slice';
import { setCharacterId } from '../data/whoami-slice';
import { Character } from '../types';
import { saveCharacterAsYaml } from '../util/download';
import SimpleDice from './simple-dice';
import {
    Button,
    Icon,
    Intent,
    ButtonGroup,
    Menu,
    MenuItem,
    Popover,
    Classes,
} from '@blueprintjs/core';
import { useDispatch, useSelector } from 'react-redux';

type Props = {
    character: Character;
};

const CharacterMenu = ({ character: characterProp }: Props) => {
    const dispatch = useDispatch();
    const characterToEdit = useSelector(selectEditingCharacter);
    const character = characterToEdit || characterProp;

    return (
        <div className="character-menu">
            {!characterToEdit && (
                <>
                    <SimpleDice hasSkillButton />
                    <ButtonGroup>
                        <Popover
                            interactionKind="click"
                            minimal={false}
                            placement="bottom"
                            content={
                                <Menu>
                                    <MenuItem
                                        icon="horizontal-bar-chart-asc"
                                        text="YAML"
                                        onClick={() => saveCharacterAsYaml(character)}
                                    />
                                </Menu>
                            }
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        >
                            <Button icon="download" title="Download" aria-label="Download" />
                        </Popover>
                        <Button
                            onClick={() => {
                                dispatch(editCharacter(character));
                            }}
                        >
                            <Icon icon="edit" title="Edit" htmlTitle="Edit" />
                        </Button>
                    </ButtonGroup>
                </>
            )}
            {characterToEdit && (
                <>
                    <Popover
                        interactionKind="click"
                        popoverClassName={Classes.POPOVER_CONTENT_SIZING}
                        placement="auto"
                        content={
                            <div>
                                <p>Are you sure you want to delete this character?</p>
                                <Button
                                    onClick={() => {
                                        finishEditing();
                                        dispatch(deleteCharacter(character.id));
                                        dispatch(setCharacterId('new-character-page'));
                                    }}
                                    intent={Intent.DANGER}
                                    className={Classes.POPOVER_DISMISS}
                                    text="Yes"
                                />
                            </div>
                        }
                    >
                        <Button intent={Intent.DANGER}>
                            <Icon
                                icon="trash"
                                title="Delete Character"
                                htmlTitle="Delete Character"
                            />
                        </Button>
                    </Popover>

                    <Button onClick={finishEditing} intent={Intent.PRIMARY}>
                        <Icon icon="floppy-disk" title="Save" htmlTitle="Save" />
                    </Button>
                </>
            )}
        </div>
    );
};

export default CharacterMenu;
