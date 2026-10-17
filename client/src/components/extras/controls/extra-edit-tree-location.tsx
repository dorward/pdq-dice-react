import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    HTMLSelect,
    Label,
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
            if (typeof extra.count !== 'number' || extra.count <= 1) {
                return dispatch(moveSomeExtra({ ...data, count: extra.count }));
            }
            setMoveData({ count: 1, location: e.target.value });
        },
        [dispatch, extra.count, extra.id],
    );

    const locationName = (id: string) =>
        id
            ? (containers.find((container) => container.id === id)?.name ?? 'Unknown location')
            : 'Top level';
    const maxCount = typeof extra.count === 'number' ? extra.count : 1;

    return (
        <>
            <Label>
                <span>Location</span>
                <HTMLSelect
                    className="extra-tree-edit-location"
                    value={extra.location}
                    onChange={onChange}
                >
                    <option key="top-level" label="🔝" value="" />
                    {containers
                        .filter(({ id }) => !descendants.includes(id))
                        .map(({ id, name }) => (
                            <option key={id} label={name} value={id} />
                        ))}
                </HTMLSelect>
            </Label>
            <Dialog
                isOpen={Boolean(moveData.count)}
                onClose={() => setMoveData(defaultMoveData)}
                title="Move inventory item"
                className="extra-move-dialog"
            >
                <DialogBody>
                    <p>
                        Moving {extra.name} from {locationName(extra.location)} to{' '}
                        {locationName(moveData.location)}
                    </p>

                    {maxCount > 1 && (
                        <Slider
                            min={1}
                            max={maxCount}
                            labelStepSize={Math.max(1, Math.ceil((maxCount - 1) / 5))}
                            stepSize={1}
                            handleHtmlProps={{ 'aria-label': 'Quantity to move' }}
                            value={moveData.count}
                            onChange={(count) => setMoveData({ ...moveData, count })}
                        />
                    )}
                </DialogBody>
                <DialogFooter>
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
                </DialogFooter>
            </Dialog>
        </>
    );
};

export default ExtraEditLocation;
