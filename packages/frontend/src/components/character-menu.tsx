import { Button, Icon, Intent } from '@blueprintjs/core';
import { Character } from '../types';
import { Classes, Popover2 } from '@blueprintjs/popover2';
import { deleteCharacter } from '../data/user-slice';
import { editCharacter, selectEditingCharacter } from '../data/edit-mode-slice';
import { finishEditing } from '../data/helpers';
import { setCharacterId } from '../data/whoami-slice';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import SimpleDice from './simple-dice';

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
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						renderTarget={({ isOpen, ref, ...targetProps }) => (
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
	);
};

export default CharacterMenu;
