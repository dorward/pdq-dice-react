import React from 'react';

import { HTMLTable } from '@blueprintjs/core';
import { Props } from './types';
import ExtraCircumstanceRow from './extra-circumstance-row';
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
						<ExtraPlayRow key={extra.id} extra={extra} />
					))}
					<ExtraCircumstanceRow key="circumstance" />
				</tbody>
			</HTMLTable>
		</>
	);
};

export default ExtrasPlay;
