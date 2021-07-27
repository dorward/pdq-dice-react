import React from 'react';

import { FormGroup, H2, InputGroup } from '@blueprintjs/core';
import { selectBennies } from '../data/user-slice';
import { selectEditingCharacter } from '../data/edit-mode-slice';
import { updateName } from '../data/edit-mode-slice';
import { useDispatch, useSelector } from 'react-redux';

type Props = {
	name: string;
};

const CharacterHeader = ({ name }: Props) => {
	const characterToEdit = useSelector(selectEditingCharacter);
	const bennies = useSelector(selectBennies) ?? { current: 0, max: 'unknown' };

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

	return (
		<div className="character-header">
			<H2>{name}</H2>
			<p>
				Bennies: {bennies.current}/{bennies.max}
			</p>
		</div>
	);
};

export default CharacterHeader;
