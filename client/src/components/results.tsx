import { Button, ButtonGroup, Card, HTMLTable, Intent, Overlay } from '@blueprintjs/core';

import { markClear, selectResults } from '../data/results-slice';
import { reset as markRollClear, selectBennyUse, useBenny } from '../data/roll-slice';
import { selectCharacterId } from '../data/whoami-slice';
import { skillCheck } from '../api/roll';
import { spendBenny } from '../data/user-slice';
import { useDispatch, useSelector } from 'react-redux';

import Loading from './loading';

const Results = () => {
    const dispatch = useDispatch();
    const results = useSelector(selectResults);
    const benniesAvailable = useSelector(selectBennyUse);
    const characterId = useSelector(selectCharacterId);
    return (
        <Overlay
            autoFocus
            enforceFocus
            onClose={() => {
                /* Clear state */
            }}
            isOpen={!!(results.loading || results.roll)}
        >
            <div className="v-center">
                <Card interactive={true} elevation={1} className="h-center results">
                    {results.loading && <Loading />}
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

                                {benniesAvailable ? (
                                    <Button
                                        onClick={() => {
                                            dispatch(useBenny());
                                            dispatch(spendBenny(characterId));
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
        </Overlay>
    );
};

export default Results;
