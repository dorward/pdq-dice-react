import React from 'react';

import { HTMLTable } from '@blueprintjs/core';
import { Props } from './types';
import ExtrasEditRow from './extra-edit-row';
import { Button, Icon } from '@blueprintjs/core';
import { useDispatch } from 'react-redux';
import { addExtra } from '../../data/edit-mode-slice';

const ExtrasEdit = ({ extras }: Props) => {
	const dispatch = useDispatch();
	return (
		<>
			<HTMLTable className="extras edit">
				<thead>
					<tr>
						<th>
							Extras
							<Button className="add" onClick={() => dispatch(addExtra())}>
								<Icon icon="add" title="Add Extra" htmlTitle="Add Extra" />
							</Button>
						</th>
						<th>Bonus</th>
					</tr>
				</thead>
				<tbody>
					{extras.map(extra => (
						<ExtrasEditRow key={extra.name} extra={extra} />
					))}
				</tbody>
			</HTMLTable>
		</>
	);
};

export default ExtrasEdit;
