import {
    updateDescription,
    selectDescription,
    selectCircumstance,
    updateCircumstance,
} from '../../data/roll-slice';
import { FormGroup, HTMLSelect, InputGroup } from '@blueprintjs/core';
import { useDispatch, useSelector } from 'react-redux';
import { extraValues, type Character } from '../../types';

type Props = {
    character: Character;
};
export const PrepareRoll = ({ character }: Props) => {
    const dispatch = useDispatch();
    const description = useSelector(selectDescription);
    const descriptionId = `${character.id}-description`;

    const extra = useSelector(selectCircumstance);
    const circumstanceId = `input-${extra.id}`;

    console.log({ extra });

    return (
        <div>
            <FormGroup label="Description of roll" labelFor={descriptionId}>
                <InputGroup
                    placeholder="What action are you rolling?"
                    id={descriptionId}
                    value={description}
                    onChange={(e) => dispatch(updateDescription(e.currentTarget.value))}
                />
            </FormGroup>

            <FormGroup label="Circumstance bonus" labelFor={circumstanceId}>
                <InputGroup
                    placeholder="Any temporary bonuses?"
                    id={circumstanceId}
                    value={extra.name}
                    onChange={(e) => {
                        const data = { id: extra.id, name: e.target.value };
                        dispatch(updateCircumstance(data));
                    }}
                    rightElement={
                        <HTMLSelect
                            value={extra.value}
                            options={extraValues.filter((value) => value !== 'DEL')}
                            onChange={(e) => {
                                const data = { id: extra.id, value: +e.target.value };
                                dispatch(updateCircumstance(data));
                            }}
                        />
                    }
                />
            </FormGroup>
        </div>
    );
};
