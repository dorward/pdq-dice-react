import {
    Button,
    Callout,
    Card,
    Classes,
    H2,
    HTMLTable,
    Intent,
    Overlay2,
} from '@blueprintjs/core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectWhoami } from '../data/whoami-slice';
import Loading from './loading';
import LuckRollStatistics from './luck-roll-statistics';

type SkillCheck = {
    id: number;
    eventTime: string;
    description: string;
    bonus: number;
    bonuses: { name: string; value: number }[];
    roll: number;
    total: number;
    benny: boolean;
};

const Statistics = ({ characterId }: { characterId: string }) => {
    const { userId, code } = useSelector(selectWhoami);
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<SkillCheck | null>(null);
    const { data, isPending, isError, refetch } = useQuery({
        queryKey: ['skill-checks', userId, code, characterId, page],
        queryFn: async ({ signal }) => {
            const path = [userId, code, characterId]
                .map((part) => encodeURIComponent(part!))
                .join('/');
            const response = await axios.get<{ checks: SkillCheck[]; hasMore: boolean }>(
                `${import.meta.env.VITE_API_URL}statistics/${path}/skill-checks`,
                { signal, params: { page } },
            );
            return response.data;
        },
        enabled: Boolean(userId && code && characterId),
    });

    const checks = data?.checks ?? [];

    return (
        <section aria-label="Statistics">
            <H2>Statistics</H2>
            {isPending && <Loading />}
            {isError && (
                <Callout intent={Intent.DANGER} title="Could not load skill checks">
                    <Button onClick={() => refetch()}>Try again</Button>
                </Callout>
            )}
            {!isPending && !isError && (
                <HTMLTable striped className="statistics-table">
                    <caption className={Classes.HEADING}>Skill checks</caption>
                    <colgroup>
                        <col />
                        <col className="statistics-date" />
                        <col className="statistics-total" />
                        <col className="statistics-details" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col">Roll</th>
                            <th scope="col">Date</th>
                            <th scope="col">Total</th>
                            <th scope="col">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {checks.map((check) => (
                            <tr key={check.id}>
                                <td>{check.description || 'Skill Check'}</td>
                                <td>
                                    <time
                                        dateTime={check.eventTime}
                                        title={new Date(check.eventTime).toLocaleString()}
                                    >
                                        {new Date(check.eventTime).toLocaleDateString()}
                                    </time>
                                </td>
                                <td>{check.total}</td>
                                <td>
                                    <Button
                                        icon="info-sign"
                                        aria-label={`Details for ${check.description || 'Skill Check'}`}
                                        onClick={() => setSelected(check)}
                                    >
                                        Details
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {checks.length === 0 && (
                            <tr>
                                <td colSpan={4}>
                                    {page === 1
                                        ? 'No skill checks recorded for this character.'
                                        : 'No skill checks on this page.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </HTMLTable>
            )}
            <nav aria-label="Skill check pages">
                <Button
                    icon="chevron-left"
                    disabled={page === 1 || isPending}
                    onClick={() => setPage((current) => current - 1)}
                >
                    Previous
                </Button>
                <span role="status"> Page {page} </span>
                <Button
                    endIcon="chevron-right"
                    disabled={isPending || isError || !data?.hasMore}
                    onClick={() => setPage((current) => current + 1)}
                >
                    Next
                </Button>
            </nav>
            <LuckRollStatistics characterId={characterId} />
            <Overlay2 isOpen={!!selected} onClose={() => setSelected(null)}>
                <div className="v-center">
                    <Card
                        className="h-center results"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="statistics-roll-title"
                    >
                        {selected && (
                            <>
                                <H2 id="statistics-roll-title">
                                    {selected.description || 'Skill Check'}
                                </H2>
                                <p>{new Date(selected.eventTime).toLocaleString()}</p>
                                <HTMLTable>
                                    <tbody>
                                        <tr>
                                            <th scope="row">Dice total</th>
                                            <td>{selected.roll}</td>
                                        </tr>
                                        {selected.bonuses.map((bonus, index) => (
                                            <tr key={index}>
                                                <th scope="row">{bonus.name}</th>
                                                <td>{bonus.value}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <th scope="row">Bonus total</th>
                                            <td>{selected.bonus}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Benny used</th>
                                            <td>{selected.benny ? 'Yes' : 'No'}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Total</th>
                                            <td>{selected.total}</td>
                                        </tr>
                                    </tbody>
                                </HTMLTable>
                                <Button
                                    autoFocus
                                    intent={Intent.PRIMARY}
                                    onClick={() => setSelected(null)}
                                >
                                    OK
                                </Button>
                            </>
                        )}
                    </Card>
                </div>
            </Overlay2>
        </section>
    );
};

export default Statistics;
