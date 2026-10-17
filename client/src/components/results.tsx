import {
    Button,
    ButtonGroup,
    Callout,
    Card,
    HTMLTable,
    Intent,
    Overlay2,
} from '@blueprintjs/core';

import { markClear, selectResults } from '../data/results-slice';
import { reset as markRollClear, selectBennyUse } from '../data/roll-slice';
import { skillCheck } from '../api/roll';
import { useDispatch, useSelector } from 'react-redux';

import Loading from './loading';

const Results = () => {
    const dispatch = useDispatch();
    const results = useSelector(selectResults);
    const benniesAvailable = useSelector(selectBennyUse);
    return (
        <Overlay2
            autoFocus
            enforceFocus
            onClose={() => {
                /* Clear state */
            }}
            isOpen={!!(results.loading || results.roll || results.error)}
        >
            <div className="v-center">
                <Card
                    interactive={true}
                    elevation={1}
                    className={`h-center results${results.loading ? ' is-loading' : ''}`}
                >
                    {results.loading && <Loading />}
                    {results.error && (
                        <>
                            <Callout intent={Intent.DANGER} title="Roll failed">
                                {results.error}
                            </Callout>
                            <Button onClick={() => dispatch(markClear())}>OK</Button>
                        </>
                    )}
                    {results?.roll?.results && (
                        <>
                            <div>
                                <h2>Result: {results.roll.total}</h2>
                                <HTMLTable>
                                    <tbody>
                                        {results.roll.results.map((result) => (
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
                                    autoFocus
                                    onClick={() => {
                                        dispatch(markRollClear());
                                        dispatch(markClear());
                                    }}
                                    intent={Intent.PRIMARY}
                                >
                                    OK
                                </Button>

                                {results.roll.rollType === 'Skill Check' && benniesAvailable ? (
                                    <Button
                                        onClick={() => {
                                            skillCheck({ isUsingBenny: true });
                                        }}
                                        className="bennyButton"
                                        intent={Intent.NONE}
                                    >
                                        Benny ({benniesAvailable})
                                    </Button>
                                ) : null}
                            </ButtonGroup>
                        </>
                    )}
                </Card>
            </div>
        </Overlay2>
    );
};

export default Results;
