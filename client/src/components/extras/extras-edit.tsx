import { Button, HTMLTable, Icon } from '@blueprintjs/core';
import { Props } from './types';
import { addExtra } from '../../data/edit-mode-slice';
import { useDispatch } from 'react-redux';
import ExtrasEditRow from './extra-edit-row';

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
						<ExtrasEditRow key={extra.id} extra={extra} />
					))}
				</tbody>
			</HTMLTable>
		</>
	);
};

export default ExtrasEdit;
