import { selectEditingCharacter } from '../../data/edit-mode-slice';
import CharacterBackground from '../character-background';
import CharacterHeaderEdit from './character-header-edit';
import type { Props } from './character-header-types';
import CharacterHeaderView from './character-header-view';
import { useSelector } from 'react-redux';

type AllProps = Props & {
    background?: string;
};

const CharacterHeader = (props: AllProps) => {
    const characterToEdit = useSelector(selectEditingCharacter);
    const Top = characterToEdit ? CharacterHeaderEdit : CharacterHeaderView;
    const { background, ...rest } = props;
    return (
        <>
            <Top {...rest} />
            <CharacterBackground background={background} />
        </>
    );
};

export default CharacterHeader;
