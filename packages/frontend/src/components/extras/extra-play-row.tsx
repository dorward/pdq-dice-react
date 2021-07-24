import React from 'react';
import { RowProps } from './types';
// import { HTMLSelect, FormGroup, InputGroup } from '@blueprintjs/core';
// import { updateExtra } from '../../data/edit-mode-slice';
// import { useDispatch } from 'react-redux';

const ExtraPlayRow = ({ extra }: RowProps) => {
	// const dispatch = useDispatch();

	return (
		<tr key={extra.name}>
			<td key="label">{extra.name}</td>
			<td>{extra.value}</td>
		</tr>
	);
};

export default ExtraPlayRow;
