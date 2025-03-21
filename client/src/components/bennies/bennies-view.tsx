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

const bennyValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const Bennies = () => {
    const characterToEdit = useSelector(selectEditingCharacter);
    if (characterToEdit) {
        return <BenniesEdit characterToEdit={characterToEdit} />;
    }

    return <BenniesView />;
};

const BenniesView = () => {
    const bennies = useSelector(selectBennies) ?? { current: 0, max: 'unknown' };

    return (
        <div className="bennies">
            <H2 className="bennies-heading">Bennies</H2>
            <span className="field bennies-value" id="field-bennies">
                <span className="bennies-current">{bennies.current}</span>
                <span className="sep"> / </span>
                <span className="bennies-max">{bennies.max}</span>
            </span>
        </div>
    );
};

type EditProps = {
    characterToEdit: Character & SelectedExtra;
};

const BenniesEdit = ({ characterToEdit }: EditProps) => {
    const dispatch = useDispatch();

    return (
        <div className="bennies-edit">
            <FormGroup inline label="Current Bennies" labelFor="current-bennies-edit">
                <HTMLSelect
                    id="current-bennies-edit"
                    value={characterToEdit.bennies.current ?? '0'}
                    options={bennyValues}
                    onChange={(e) => {
                        const count = +e.target.value;
                        dispatch(updateCurrentBennies(count));
                    }}
                />
            </FormGroup>

            <FormGroup inline label="Maximum Bennies" labelFor="max-bennies-edit">
                <InputGroup
                    id="max-bennies-edit"
                    value={characterToEdit.bennies.max ?? '3'}
                    onChange={(e) => dispatch(updateMaximumBennies(e.target.value))}
                />
            </FormGroup>
        </div>
    );
};
