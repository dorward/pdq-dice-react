import React from 'react';
import { Button } from '@blueprintjs/core';
import { skillCheck } from '../api/roll';
import { SelectedAttributes } from '../types';

type Props = {
	attributeState: [SelectedAttributes, (x: SelectedAttributes) => void];
};

const SkillCheck = ({ attributeState }: Props) => {
	const [selected] = attributeState;
	return (
		<Button className="skill-check" icon="random" onClick={() => skillCheck({ selected })}>
			Skill Check
		</Button>
	);
};

export default SkillCheck;
