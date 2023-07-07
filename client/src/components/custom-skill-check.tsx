import { simpleSkillCheck } from '../api/roll';
import { Button, Classes, FormGroup, NumericInput } from '@blueprintjs/core';
import { useState } from 'react';

const CustomSkillCheck: React.FC = () => {
	const [modifier, setMod] = useState(0);
	const [description, setDesc] = useState('');

	const callback = () => {
		simpleSkillCheck({ modifier, description });
	};

	return (
		<div className="custom-skill-check">
			<FormGroup label="Modifier" inline>
				<NumericInput onValueChange={val => setMod(val)} value={modifier} />
			</FormGroup>
			<FormGroup label="Description" inline>
				<input className={Classes.INPUT} onChange={e => setDesc(e.currentTarget.value)} value={description} />
			</FormGroup>
			<Button icon="random" onClick={callback}>
				Skill Check
			</Button>
		</div>
	);
};

export default CustomSkillCheck;
