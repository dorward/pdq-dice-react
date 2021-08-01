import React from 'react';

import { FormGroup, Button, H2, HTMLSelect, InputGroup, Icon, IconSize } from '@blueprintjs/core';
import { selectBennies } from '../data/user-slice';
import {
	selectEditingCharacter,
	updateCurrentBennies,
	updateMaximumBennies,
	updateName,
} from '../data/edit-mode-slice';
import { useDispatch, useSelector } from 'react-redux';

type Props = {
	name: string;
};

const bennyValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const CharacterHeader = ({ name }: Props) => {
	const dispatch = useDispatch();
	const characterToEdit = useSelector(selectEditingCharacter);
	const bennies = useSelector(selectBennies) ?? { current: 0, max: 'unknown' };
	const avatarUrl = 'http://placekitten.com/60/60';

	if (characterToEdit) {
		return (
			<>
				<div className="character-id-editor">
					<Button>
						<div className="icon-container">
							<Icon icon="upload" title="Change avatar" size={IconSize.LARGE} color="black" />
						</div>
						<img src={avatarUrl} alt="" />
					</Button>
					<FormGroup label="Character name" labelFor="character-name-edit">
						<InputGroup
							id="character-name-edit"
							value={characterToEdit.name}
							onChange={e => dispatch(updateName(e.target.value))}
						/>
					</FormGroup>
				</div>

				<div className="bennies-edit">
					<FormGroup inline label="Current Bennies" labelFor="current-bennies-edit">
						<HTMLSelect
							id="current-bennies-edit"
							value={characterToEdit.bennies.current}
							options={bennyValues}
							onChange={e => {
								const count = +e.target.value;
								dispatch(updateCurrentBennies(count));
							}}
						/>
					</FormGroup>

					<FormGroup inline label="Maximum Bennies" labelFor="max-bennies-edit">
						<InputGroup
							id="max-bennies-edit"
							value={characterToEdit.bennies.max}
							onChange={e => dispatch(updateMaximumBennies(e.target.value))}
						/>
					</FormGroup>
				</div>
			</>
		);
	}

	return (
		<div className="character-header">
			<img src={avatarUrl} alt="" />
			<H2>{name}</H2>
			<p>
				Bennies: {bennies.current}/{bennies.max}
			</p>
		</div>
	);
};

export default CharacterHeader;
