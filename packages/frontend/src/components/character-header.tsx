import React from 'react';

import { FormGroup, H2, InputGroup } from '@blueprintjs/core';
import { selectEditingCharacter } from '../data/edit-mode-slice';
import { updateName } from '../data/edit-mode-slice';
import { useDispatch, useSelector } from 'react-redux';

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
