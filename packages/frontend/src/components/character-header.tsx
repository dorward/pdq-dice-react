import React from 'react';

import { selectEditingCharacter } from '../data/edit-mode-slice';
import { useSelector } from 'react-redux';
import { H2, FormGroup, InputGroup } from '@blueprintjs/core';
import { updateName } from '../data/edit-mode-slice';
import { useDispatch } from 'react-redux';

type Props = {
	name: string;
};

const CharacterHeader = ({ name }: Props) => {
	const characterToEdit = useSelector(selectEditingCharacter);
	const dispatch = useDispatch();

	if (characterToEdit) {
		return (
			<FormGroup label="Character name" labelFor="character-name-edit">
				<InputGroup
					id="character-name-edit"
					value={characterToEdit.name}
					onChange={e => dispatch(updateName(e.target.value))}
				/>
			</FormGroup>
		);
	}

	return <H2>{name}</H2>;
};

export default CharacterHeader;
