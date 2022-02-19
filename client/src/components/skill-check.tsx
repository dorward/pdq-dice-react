import { Button } from '@blueprintjs/core';
import { skillCheck } from '../api/roll';
import React from 'react';

const SkillCheck = () => {
	return (
		<Button className="skill-check" icon="random" onClick={() => skillCheck()}>
			Skill Check
		</Button>
	);
};

export default SkillCheck;
