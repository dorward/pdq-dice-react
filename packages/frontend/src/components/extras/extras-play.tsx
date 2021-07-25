import React from 'react';

import { HTMLTable } from '@blueprintjs/core';
import { Props } from './types';
import ExtraEditRow from './extra-edit-row';
import ExtraPlayRow from './extra-play-row';

const ExtrasPlay = ({ extras }: Props) => {
	return (
		<>
			<HTMLTable className="extras edit">
				<thead>
					<tr>
						<th>Extras</th>
						<th>Bonus</th>
					</tr>
				</thead>
				<tbody>
					{extras.map(extra => (
						<ExtraPlayRow key={extra.name} extra={extra} />
					))}
					<ExtraEditRow
						key="circumstance"
						extra={{
							id: 'circumstance',
							name: 'Circumstance',
							value: 0,
						}}
					/>
				</tbody>
			</HTMLTable>
		</>
	);
};

export default ExtrasPlay;
