import { Button, Icon } from '@blueprintjs/core';
import { useDispatch } from 'react-redux';
import { spendInventoryItem } from '../../data/user-slice';
import { selectCharacterId } from '../../data/whoami-slice';
import { useSelector } from 'react-redux';
import { expend } from '../../api/expend';
import { Extra } from '../../types';
import { useRef, useState } from 'react';

type Props = { extraId: string; extraName: string } | Extra;

// TODO get rid of the OR part of this and just pass an extra.
const Expend = (props: Props) => {
    let extraName: string;
    let extraId: string;
    if ('id' in props) {
        extraName = props.name;
        extraId = props.id;
    } else {
        extraName = props.extraName;
        extraId = props.extraId;
    }
    const dispatch = useDispatch();
    const title = `Expend one`;
    const characterId = useSelector(selectCharacterId);
    const pending = useRef(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    return (
        <>
            <Button
                minimal
                aria-label={`Expend one ${extraName}`}
                loading={loading}
                style={{ marginLeft: '6px' }}
                onClick={async (e) => {
                    e.stopPropagation();
                    if (pending.current) return;
                    pending.current = true;
                    setLoading(true);
                    setError('');
                    try {
                        await expend(extraName);
                        dispatch(
                            spendInventoryItem({
                                characterId,
                                extraId,
                            }),
                        );
                    } catch {
                        setError(
                            'The item could not be expended. Your inventory has not been consumed. Please try again.',
                        );
                    } finally {
                        pending.current = false;
                        setLoading(false);
                    }
                }}
            >
                <Icon
                    icon="remove"
                    title={title}
                    htmlTitle={title}
                    style={{ display: 'inline-block' }}
                />
            </Button>
            {error && <span role="alert">{error}</span>}
        </>
    );
};

export default Expend;
