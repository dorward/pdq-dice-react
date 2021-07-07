import React, { useState, useEffect } from 'react';
import { Attribute, UserData } from '../types';
import { H2, H3, HTMLTable } from '@blueprintjs/core';

type Props = {
	attributes: Attribute[];
	title: string;
};

const values = [
	['MSTR', 6],
	['EXP', 4],
	['GD', 2],
	['AVG', 0],
	['PR', -2],
	['GONE', -Infinity],
] as const;

const AttributeRow = ({ attribute }: { attribute: Attribute }) => {
	return (
		<tr>
			<td>
				<label>
					<input type="checkbox" name={attribute.name} value="use" /> {attribute.name}
				</label>
			</td>
            {values.map(([name, score]) => {
                const available = score > attribute.value
            return <td></td>
})}
		</tr>
	);
};

const Attributes = ({ attributes, title }: Props) => {
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
						<AttributeRow attribute={attribute} />
					))}
				</tbody>
			</HTMLTable>
		</>
	);
};

export default Attributes;
