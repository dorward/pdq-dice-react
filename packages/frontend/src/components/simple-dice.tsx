import React from 'react';
import { Button, ButtonGroup } from '@blueprintjs/core';
import { d6 } from '../api/roll';
import SkillCheck from './skill-check';
import { SelectedAttributes } from '../types';

type Props = {
	attributeState?: [SelectedAttributes, (x: SelectedAttributes) => void];
};

const SimpleDice = ({ attributeState }: Props) => {
	return (
		<ButtonGroup>
			{attributeState && <SkillCheck attributeState={attributeState} />}

			<Button icon="random" onClick={() => d6({})}>
				d6
			</Button>
			<Button icon="double-chevron-up" onClick={() => d6({ high: true })}>
				Luck (High)
			</Button>
			<Button icon="double-chevron-down" onClick={() => d6({ high: false })}>
				Luck (Low)
			</Button>
		</ButtonGroup>
	);
};

export default SimpleDice;
