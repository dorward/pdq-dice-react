import { Button, ButtonGroup, Card, Intent, Overlay } from '@blueprintjs/core';
import { HTMLTable } from '@blueprintjs/core';
import { markClear, selectResults } from '../data/results-slice';
import { reset as markRollClear } from '../data/roll-slice';
import { selectCharacterId } from '../data/whoami-slice';
import { skillCheck } from '../api/roll';
import { spendBennie } from '../data/user-slice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Loading from './loading';
import React from 'react';

const Results = () => {
	const dispatch = useDispatch();
	const results = useSelector(selectResults);
	const characterId = useSelector(selectCharacterId);
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
							<div>
								<h2>Result</h2>
								<HTMLTable>
									<tbody>
										{results.roll.results.map(result => (
											<tr key={result.name}>
												<td>{result.name}</td>
												<td>{result.value}</td>
											</tr>
										))}
									</tbody>
								</HTMLTable>
							</div>
							<ButtonGroup>
								<Button
									onClick={() => {
										dispatch(markRollClear());
										dispatch(markClear());
									}}
									intent={Intent.PRIMARY}>
									OK
								</Button>

								<Button
									onClick={() => {
										dispatch(spendBennie(characterId));
										skillCheck();
									}}
									intent={Intent.NONE}>
									Benny
								</Button>
							</ButtonGroup>
						</>
					)}
				</Card>
			</div>
		</Overlay>
	);
};

export default Results;
