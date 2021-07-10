
import React, { useState, useEffect } from 'react';
import { Attribute, UserData } from '../types';
import { H2, H3, HTMLTable, Icon } from '@blueprintjs/core';
import { attributeValues } from '../consts';


export type RowProps = { 
	attribute: Attribute 
};


const AttributeRow = ({ attribute }: RowProps) => {
	console.log({ attribute });
	const attributeValue = attributeValues.filter(value => value[0] === attribute.value)[0][1];

	return (<tr>
			<td>
				<label>
					<input type="checkbox" name={attribute.name} value="use" /> {attribute.name}
				</label>
			</td>
            {attributeValues.map(([_name, score]) => {
                const available = score <= attributeValue;
    	        return <td>{available ? <Icon icon="tick-circle" /> : ""}</td>;
			})}
		</tr>
	);
};

export default AttributeRow