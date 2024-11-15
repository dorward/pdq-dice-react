import {
    Button,
    Card,
    Elevation,
    HTMLSelect,
    Label,
    Overlay2,
    Slider,
} from '@blueprintjs/core';
import { moveSomeExtra } from '../../../data/edit-mode-slice';
import { Extra, ExtraContainer, isExtraContainer } from '../../../types';
import { useDispatch } from 'react-redux';
import findDescendants from '../find-descendants';
import { useCallback, useMemo, useState } from 'react';

type ExtraEditLocationProps = {
    extra: Extra;
    containers: ExtraContainer[];
};

type SimpleTransferAmount = number | '∞';
const simpleTransferAmount: SimpleTransferAmount[] = [undefined, 0, 1, '∞'];

const ExtraEditLocation = ({ extra, containers }: ExtraEditLocationProps) => {
    const dispatch = useDispatch();
    const defaultMoveData = { count: 0, location: extra.location };
    const [moveData, setMoveData] = useState(defaultMoveData);

    const descendants = useMemo(
        () =>
            isExtraContainer(extra)
                ? [extra.id, ...findDescendants(extra, containers).map((extra) => extra.id)]
                : [extra.id],
        [containers, extra],
    );

    const onChange = useCallback<React.ComponentProps<typeof HTMLSelect>['onChange']>(
        (e) => {
            const data = { id: extra.id, location: e.target.value };
            if (simpleTransferAmount.includes(extra.count)) {
                return dispatch(moveSomeExtra({ ...data, count: extra.count }));
            }
            setMoveData({ count: 1, location: e.target.value });
        },
        [dispatch, extra.count, extra.id],
    );

    return (
        <>
            <Label>
                <span>Location</span>
                <HTMLSelect
                    className="extra-tree-edit-location"
                    value={extra.location}
                    onChange={onChange}
                >
                    <option key="top-level" label="🔝" value="" />;
                    {containers
                        .filter(({ id }) => !descendants.includes(id))
                        .map(({ id, name }) => (
                            <option key={id} label={name} value={id} />
                        ))}
                </HTMLSelect>
            </Label>
            <Overlay2 isOpen={Boolean(moveData.count)}>
                <div className="v-center">
                    <Card elevation={Elevation.ONE} className="h-center">
                        <p>
                            Moving {extra.name} from {extra.location} to {moveData.location}
                        </p>

                        <Slider
                            min={1}
                            max={typeof extra.count === 'number' ? extra.count : 1}
                            value={moveData.count}
                            onChange={(count) => setMoveData({ ...moveData, count })}
                        />
                        <Button
                            onClick={() => {
                                dispatch(moveSomeExtra({ id: extra.id, ...moveData }));
                                setMoveData(defaultMoveData);
                            }}
                        >
                            Move {moveData.count}
                        </Button>
                        <Button
                            onClick={() => {
                                dispatch(
                                    moveSomeExtra({
                                        id: extra.id,
                                        location: moveData.location,
                                        count: extra.count,
                                    }),
                                );
                                setMoveData(defaultMoveData);
                            }}
                        >
                            Move all
                        </Button>
                    </Card>
                </div>
            </Overlay2>
        </>
    );
};

export default ExtraEditLocation;
