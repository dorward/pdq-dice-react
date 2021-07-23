import React from 'react';
import { Overlay, Card, Button } from '@blueprintjs/core';
import { selectResults } from '../data/results-slice';
import { useSelector } from 'react-redux';
import { markClear } from '../data/results-slice';
import { useDispatch } from 'react-redux';
import Loading from './loading';
import { HTMLTable } from '@blueprintjs/core';

const Results = () => {
	const dispatch = useDispatch();
	const results = useSelector(selectResults);
	return (
		<Overlay
			autoFocus
			enforceFocus
			onClose={() => {
				/* Clear state */
			}}
			isOpen={!!(results.loading || results.roll)}>
			<div className="v-center">
				<Card interactive={true} elevation={1} className="h-center results">
					{results.loading && <Loading />}
					{results?.roll?.results && (
						<>
							<HTMLTable>
								<tbody>
									{results.roll.results.map(result => (
										<tr>
											<td>{result.name}</td>
											<td>{result.value}</td>
										</tr>
									))}
								</tbody>
							</HTMLTable>

							<Button onClick={() => dispatch(markClear())} intent="primary">
								OK
							</Button>
						</>
					)}
				</Card>
			</div>
		</Overlay>
	);
};

export default Results;
