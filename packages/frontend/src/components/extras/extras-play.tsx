import React, { useState } from 'react';

import { Extra } from '../../types';
import { HTMLTable, Button } from '@blueprintjs/core';
import { Props } from './types';
import ExtraCircumstanceRow from './extra-circumstance-row';
import ExtraPlayRow from './extra-play-row';

type CategorisedExtras = [Extra[], Record<string, Extra[]>];
type OpenLocations = Record<string, boolean>;

const ExtrasPlay = ({ extras }: Props) => {
	const categorisedExtras: CategorisedExtras = extras.reduce(
		(acc, extra) => {
			const { location } = extra;
			if (!location) {
				acc[0].push(extra);
				return acc;
			}

			acc[1][location] ??= [];
			acc[1][location].push(extra);
			return acc;
		},
		[[], {}] as CategorisedExtras
	);

	const [openLocations, setOpenLocations] = useState<OpenLocations>({});

	return (
		<>
			<HTMLTable className="extras edit">
				<thead>
					<tr>
						<th>Extras</th>
						<th>Bonus</th>
					</tr>
				</thead>
				<tbody key="about-person-key">
					{categorisedExtras[0].map(extra => (
						<ExtraPlayRow key={extra.id} extra={extra} />
					))}
				</tbody>
				{Object.entries(categorisedExtras[1]).map(([location, extras]) => (
					<tbody key={location}>
						<tr key="heading" className="location-heading">
							<th colSpan={2}>
								<Button
									minimal
									icon={openLocations[location] ? 'caret-down' : 'caret-right'}
									aria-label={`${openLocations[location] ? 'Close' : 'Open'} ${location} extras`}
									onClick={() => setOpenLocations(locations => ({ ...locations, [location]: !locations[location] }))}>
									{location}
								</Button>
							</th>
						</tr>
						{openLocations[location] && extras.map(extra => <ExtraPlayRow key={extra.id} extra={extra} />)}
					</tbody>
				))}
				<tbody>
					<tr key="circumstance-heading" className="location-heading">
						<th colSpan={2}>Circumstance Bonus</th>
					</tr>
					<ExtraCircumstanceRow key="circumstance" />
				</tbody>
			</HTMLTable>
		</>
	);
};

export default ExtrasPlay;
