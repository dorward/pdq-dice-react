import { Props as AttributesProps } from './attributes/types';
import { Button, FormGroup, Icon, InputGroup, Intent } from '@blueprintjs/core';
import { Character } from '../types';
import { Classes, Popover2 } from '@blueprintjs/popover2';
import { deleteCharacter } from '../data/user-slice';
import { editCharacter, selectEditingCharacter } from '../data/edit-mode-slice';
import { finishEditing } from '../data/helpers';
import { setCharacterId } from '../data/whoami-slice';
import { useDispatch, useSelector } from 'react-redux';
import Attributes from './attributes';
import CharacterHeader from './character-header';
import Extras from './extras';
import React, { useState } from 'react';
import SimpleDice from './simple-dice';
import SkillCheck from './skill-check';

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
	const dispatch = useDispatch();
	const characterToEdit = useSelector(selectEditingCharacter);
	const character = characterToEdit || characterProp;
	const [description, setDescription] = useState('');
	const descriptionId = `${character.id}-description`;
	return (
		<>
			<div className="character-sheet">
				<div className="character-menu">
					{!characterToEdit && (
						<>
							<SimpleDice hasSkillButton />
							<Button
								onClick={() => {
									dispatch(editCharacter(character));
								}}>
								<Icon icon="edit" title="Edit" htmlTitle="Edit" />
							</Button>
						</>
					)}
					{characterToEdit && (
						<>
							<Popover2
								interactionKind="click"
								popoverClassName={Classes.POPOVER2_CONTENT_SIZING}
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
											className={Classes.POPOVER2_DISMISS}
											text="Yes"
										/>
									</div>
								}
								renderTarget={({ ref, ...targetProps }) => (
									<Button {...targetProps} elementRef={ref} intent={Intent.DANGER}>
										<Icon icon="trash" title="Delete Character" htmlTitle="Delete Character" />
									</Button>
								)}
							/>

							<Button onClick={finishEditing} intent={Intent.PRIMARY}>
								<Icon icon="floppy-disk" title="Save" htmlTitle="Save" />
							</Button>
						</>
					)}
				</div>
				<CharacterHeader name={character.name} />
				<Attributes {...{ ...qualities, character }} />
				<Attributes {...{ ...powers, character }} />
				<Extras extras={character.extras} />
				{!characterToEdit && (
					<div className="controls">
						<FormGroup label="Description of roll" labelFor={descriptionId}>
							<InputGroup
								placeholder="What action are you rolling?"
								id={descriptionId}
								value={description}
								onChange={e => setDescription(e.currentTarget.value)}
							/>
						</FormGroup>
						<SkillCheck />
					</div>
				)}
			</div>
		</>
	);
};

export default CharacterSheet;
