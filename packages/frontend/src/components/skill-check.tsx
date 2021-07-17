import React from 'react';
import { Button, ButtonGroup } from '@blueprintjs/core';
import { skillCheck } from '../api/roll';
import { SelectedAttributes } from '../types';

type Props = {
	attributeState: [SelectedAttributes, (x: SelectedAttributes) => void];
};

const SkillCheck = ({ attributeState }: Props) => {
	const [selected] = attributeState;
	return (
		<ButtonGroup>
			<Button icon="random" onClick={() => skillCheck({ selected })}>
				Skill Check
			</Button>
		</ButtonGroup>
	);
};

export default SkillCheck;
