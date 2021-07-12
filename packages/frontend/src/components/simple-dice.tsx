import React from 'react';
import { Button, ButtonGroup } from '@blueprintjs/core';
import { useDispatch } from 'react-redux';
import { markLoading, setResult } from '../data/results-slice';
import { d6 } from '../api/roll';

const SimpleDice = () => {
	const dispatch = useDispatch();
	return (
		<ButtonGroup>
			<Button
				icon="random"
				onClick={() => {
					dispatch(markLoading());
					d6();
				}}>
				d6
			</Button>
			<Button
				icon="double-chevron-up"
				onClick={() => {
					dispatch(markLoading());
					setTimeout(() => dispatch(setResult(2)), 1000);
				}}>
				Luck (High)
			</Button>
			<Button
				icon="double-chevron-down"
				onClick={() => {
					dispatch(markLoading());
					setTimeout(() => dispatch(setResult(3)), 1000);
				}}>
				Luck (Low)
			</Button>
		</ButtonGroup>
	);
};

export default SimpleDice;
