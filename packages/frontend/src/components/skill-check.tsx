import React from 'react';
import { Button } from '@blueprintjs/core';
import { skillCheck } from '../api/roll';
import { RollData } from '../types';

type Props = {
	options: RollData;
};

const SkillCheck = ({ options }: Props) => {
	const { description, attributeState } = options;
	const [selected] = attributeState;
	return (
		<Button className="skill-check" icon="random" onClick={() => skillCheck({ selected, description })}>
			Skill Check
		</Button>
	);
};

export default SkillCheck;
