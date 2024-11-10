// Deprecated

import { Button, HTMLTable, Icon, Radio, RadioGroup } from '@blueprintjs/core';
import { Props } from './types';
import { addInventoryItem } from '../../data/edit-mode-slice';
import { useDispatch } from 'react-redux';
import ExtrasEditRow from './extra-edit-row';
import sortExtras from './sort-extras';
import { useState } from 'react';
import type { ExtraSortOrder } from '../../types';

const ExtrasEdit = ({ extras }: Props) => {
	const dispatch = useDispatch();
	const [sortOrder, setSortOrder] = useState<ExtraSortOrder>('name');
	const sorted = sortExtras(extras, sortOrder);
	return (
		<>
			<HTMLTable className="extras edit">
				<thead>
					<tr>
						<th>
							<div className="header">
								<span className="label">Extras</span>
								<Button className="add" onClick={() => dispatch(addInventoryItem())}>
									<Icon icon="add" title="Add Extra" htmlTitle="Add Extra" />
								</Button>
								<RadioGroup
									className="sort-by-menu"
									inline={true}
									onChange={e => setSortOrder((e.target as HTMLInputElement).value as ExtraSortOrder)}
									selectedValue={sortOrder}>
									<Radio label="Name" value="name" />
									<Radio label="Location" value="location" />
								</RadioGroup>
							</div>
						</th>
						<th>
							<div className="header">
								<span className="bonus">Bonus</span>
							</div>
						</th>
					</tr>
				</thead>
				<tbody>
					{sorted.map(extra => (
						<ExtrasEditRow key={extra.id} extra={extra} />
					))}
				</tbody>
			</HTMLTable>
		</>
	);
};

export default ExtrasEdit;
