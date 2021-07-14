import React from 'react';
import { Button, ButtonGroup } from '@blueprintjs/core';
import { useDispatch } from 'react-redux';
import { d6 } from '../api/roll';

const SimpleDice = () => {
	const dispatch = useDispatch();
	return (
		<ButtonGroup>
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
