import { Checkbox } from '@blueprintjs/core';
import { Extra, ExtraContainer, isExtraContainer } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelected, toggleSelected } from '../../data/roll-slice';
import Count from './extras-tree-play-count';
import { extraCountValues as defaultExtraCountValues } from '../../types';
import { useMemo } from 'react';
import CapacityFlag from './capacity-flag';
import ExtraContainerEditor from './extra-container-editor';
import ExtraItemEditor from './extra-item-editor';

type ItemProps = {
    extra: Extra;
    editMode: boolean;
    containers: ExtraContainer[];
    contents?: number;
};

const Item = ({ extra, editMode, containers, contents }: ItemProps) => {
    const dispatch = useDispatch();
    const selectedExtras = useSelector(selectSelected);
    const checked = !!selectedExtras[extra.id];
    const onChange = () => dispatch(toggleSelected(extra.id));

    const { id, name, count, location } = extra;
    const isContainer = isExtraContainer(extra);

    const extraCountValues = useMemo(() => {
        if (!extra.count) {
            return defaultExtraCountValues;
        }
        const included =
            defaultExtraCountValues.findIndex(
                (count) => count.toString() === extra.count.toString(),
            ) >= 0;
        if (included) {
            return defaultExtraCountValues;
        }
        const customExtraCountValues = [...defaultExtraCountValues];
        customExtraCountValues.pop();
        customExtraCountValues.push(extra.count, 'Other');
        return customExtraCountValues;
    }, [extra.count]);

    const bonus = new Intl.NumberFormat('en-GB', {
        signDisplay: 'exceptZero',
    }).format(extra.value);

    if (editMode) {
        if (isContainer) {
            return (
                <ExtraContainerEditor
                    {...{ extra, id, name, containers, dispatch, location, contents }}
                />
            );
        }
        return (
            <ExtraItemEditor
                {...{ extra, id, name, containers, dispatch, location, extraCountValues }}
            />
        );
    }

    const capacityNode = `Contains ${contents} out of ${'capacity' in extra ? extra.capacity : 'xxx'}`;

    if (count === null) {
        return (
            <span className="extra-tree-row" title={capacityNode}>
                <span>{name} </span> <CapacityFlag contents={contents} extra={extra} />
            </span>
        );
    }

    if (count === 0) {
        return (
            <span className="extra-tree-row">
                <span>{name} ×0</span>
                <CapacityFlag contents={contents} extra={extra} />
                <span className="bonus">{bonus}</span>
            </span>
        );
    }
    return (
        <span className="extra-tree-row">
            <span>
                <Checkbox checked={checked} onChange={onChange} style={{ display: 'inline' }}>
                    {name}
                </Checkbox>{' '}
                <Count extra={extra} />
            </span>{' '}
            <CapacityFlag contents={contents} extra={extra} />
            <span className="bonus">{bonus}</span>
        </span>
    );
};

export default Item;
