import type { ChangeEventHandler } from 'react';
import { selectBennies } from '../../data/user-slice';
import {
    type SelectedExtra,
    selectEditingCharacter,
    updateCurrentBennies,
    updateMaximumBennies,
} from '../../data/edit-mode-slice';
import { FormGroup, H2, HTMLSelect, InputGroup } from '@blueprintjs/core';
import { useDispatch, useSelector } from 'react-redux';
import type { Character } from '../../types';
import { useCallback } from 'react';
import { isDiceFormat, parseMaxBennyValue } from '../../util/parseMaxBennyValue';

export const Bennies = () => {
    const characterToEdit = useSelector(selectEditingCharacter);
    if (characterToEdit) {
        return <BenniesEdit characterToEdit={characterToEdit} />;
    }

    return <BenniesView />;
};

const BenniesView = () => {
    const bennies = useSelector(selectBennies) ?? { current: 0, max: 'unknown' };

    const [max, dice] = parseMaxBennyValue(bennies.max);
    const diceCount = +dice.match(isDiceFormat)[1];

    return (
        <div className="bennies">
            <H2 className="bennies-heading">Bennies</H2>
            <span className="field bennies-value" id="field-bennies">
                <span className="bennies-current">{bennies.current}</span>
                <span className="sep"> / </span>
                <span className="bennies-max">{max + (diceCount && `+${diceCount}d6`)}</span>
            </span>
        </div>
    );
};

type EditProps = {
    characterToEdit: Character & SelectedExtra;
};

const diceBonuses = ['+0d6', '+1d6'];

const BenniesEdit = ({ characterToEdit }: EditProps) => {
    const dispatch = useDispatch();

    const [max, diceBonus] = parseMaxBennyValue(characterToEdit.bennies.max);

    const updateMaxBennies = useCallback<
        ChangeEventHandler<HTMLInputElement | HTMLSelectElement>
    >((e) => dispatch(updateMaximumBennies(e.target.value)), []);

    return (
        <div className="bennies-edit">
            <FormGroup inline label="Current Bennies" labelFor="current-bennies-edit">
                <InputGroup
                    id="current-bennies-edit"
                    value={`${characterToEdit.bennies.current}`}
                    type="number"
                    onChange={(e) => {
                        const count = +e.target.value;
                        dispatch(updateCurrentBennies(count));
                    }}
                />
            </FormGroup>

            <FormGroup inline label="Default Bennies" labelFor="max-bennies-edit">
                <InputGroup
                    id="max-bennies-edit"
                    value={`${max}`}
                    type="number"
                    onChange={updateMaxBennies}
                    rightElement={
                        <HTMLSelect
                            value={diceBonus}
                            options={diceBonuses}
                            onChange={updateMaxBennies}
                        />
                    }
                />
            </FormGroup>
        </div>
    );
};
