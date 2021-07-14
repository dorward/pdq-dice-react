import React from 'react';
import { Overlay, Card, Button } from '@blueprintjs/core';
import { selectResults } from '../data/results-slice';
import { useSelector } from 'react-redux';
import { markClear } from '../data/results-slice';
import { useDispatch } from 'react-redux';
import Loading from './loading';

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
					{results.roll && (
						<>
							<pre>{JSON.stringify(results, undefined, 2)}</pre>
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
