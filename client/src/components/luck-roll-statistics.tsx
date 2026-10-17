import { Button, Callout, Classes, HTMLTable, Icon, Intent } from '@blueprintjs/core';
import { useId } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectWhoami } from '../data/whoami-slice';
import Loading from './loading';

type LuckStatistics = {
    rolls: {
        id: number;
        eventTime: string;
        seekingHigh: boolean;
        roll: number;
        success: boolean;
    }[];
    percentages: { overall: number | null; high: number | null; low: number | null };
};

const formatPercentage = (value: number | null) =>
    value === null ? '—' : `${value.toFixed(0)}%`;

const LuckRollStatistics = ({ characterId }: { characterId: string }) => {
    const iconId = useId();
    const { userId, code } = useSelector(selectWhoami);
    const { data, isPending, isError, refetch } = useQuery({
        queryKey: ['luck-rolls', userId, code, characterId],
        queryFn: async ({ signal }) => {
            const path = [userId, code, characterId]
                .map((part) => encodeURIComponent(part!))
                .join('/');
            const response = await axios.get<LuckStatistics>(
                `${import.meta.env.VITE_API_URL}statistics/${path}/luck-rolls`,
                { signal },
            );
            return response.data;
        },
        enabled: Boolean(userId && code && characterId),
    });
    return (
        <section aria-label="Luck roll statistics" className="luck-roll-statistics">
            {isPending && <Loading />}
            {isError && (
                <Callout intent={Intent.DANGER} title="Could not load luck rolls">
                    <Button onClick={() => refetch()}>Try again</Button>
                </Callout>
            )}
            {data && !isError && (
                <>
                    <HTMLTable striped className="statistics-table">
                        <caption className={Classes.HEADING}>Luck rolls</caption>
                        <colgroup>
                            <col />
                            <col className="statistics-date" />
                            <col className="statistics-total" />
                            <col className="statistics-details" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col">Seeking</th>
                                <th scope="col">Date</th>
                                <th scope="col">Roll</th>
                                <th scope="col">Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.rolls.map((roll) => (
                                <tr key={roll.id}>
                                    <td>{roll.seekingHigh ? 'High' : 'Low'}</td>
                                    <td>
                                        <time
                                            dateTime={roll.eventTime}
                                            title={new Date(roll.eventTime).toLocaleString()}
                                        >
                                            {new Date(roll.eventTime).toLocaleDateString()}
                                        </time>
                                    </td>
                                    <td>{roll.roll}</td>
                                    <td>{roll.success ? 'Success' : 'Failure'}</td>
                                </tr>
                            ))}
                            {data.rolls.length === 0 && (
                                <tr>
                                    <td colSpan={4}>
                                        No luck rolls recorded for this character.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </HTMLTable>
                    <dl className="luck-success-rates">
                        {(
                            [
                                ['overall', 'random', 'Success rate for all luck rolls'],
                                [
                                    'high',
                                    'double-chevron-up',
                                    'Success rate for high luck rolls',
                                ],
                                [
                                    'low',
                                    'double-chevron-down',
                                    'Success rate for low luck rolls',
                                ],
                            ] as const
                        ).map(([key, icon, label]) => (
                            <div key={key}>
                                <dt>
                                    <Icon
                                        id={`${iconId}-${key}`}
                                        icon={icon}
                                        role="img"
                                        aria-hidden={false}
                                        aria-label={label}
                                        title={null}
                                        htmlTitle={label}
                                    />
                                </dt>
                                <dd aria-describedby={`${iconId}-${key}`}>
                                    {formatPercentage(data.percentages[key])}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </>
            )}
        </section>
    );
};

export default LuckRollStatistics;
