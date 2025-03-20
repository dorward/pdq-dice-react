import { selectEditingCharacter } from '../../data/edit-mode-slice';
import CharacterBackground from '../character-background';
import CharacterInfoEdit from './character-info-edit';
import type { Props } from './character-info-types';
import CharacterInfoView from './character-info-view';
import { useSelector } from 'react-redux';

type AllProps = Props & {
    background?: string;
};

const CharacterInfo = (props: AllProps) => {
    const characterToEdit = useSelector(selectEditingCharacter);
    const Top = characterToEdit ? CharacterInfoEdit : CharacterInfoView;
    const { background, ...rest } = props;
    return (
        <>
            <Top {...rest} />
            <CharacterBackground background={background} />
        </>
    );
};

export default CharacterInfo;
