import React from 'react';
import { Attribute, Character } from '../types';
import { HTMLTable } from '@blueprintjs/core';
import AttributeRow from './attribute-row';

type Props = {
	attributes: Attribute[];
	title: string;
	character: Character;
	isWoundable?: boolean;
};

const Attributes = ({ attributes, title, character, isWoundable = false }: Props) => {
	return (
		<>
			<HTMLTable className="attributes">
				<thead>
					<tr>
						<th>{title}</th>
						<th>
							MSTR
							<br />
							+6
						</th>
						<th>
							EXP
							<br />
							+4
						</th>
						<th>
							GD
							<br />
							+2
						</th>
						<th>
							AVG
							<br />
							+0
						</th>
						<th>
							PR
							<br />
							-2
						</th>
						<th>
							GO
							<br />
							NE
						</th>
					</tr>
				</thead>
				<tbody>
					{attributes.map(attribute => (
						<AttributeRow key={attribute.name} {...{ attribute, character, isWoundable }} />
					))}
				</tbody>
			</HTMLTable>
		</>
	);
};

export default Attributes;
