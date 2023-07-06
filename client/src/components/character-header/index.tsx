import { selectEditingCharacter } from '../../data/edit-mode-slice';
import CharacterHeaderEdit from './character-header-edit';
import type { Props } from './character-header-types';
import CharacterHeaderView from './character-header-view';
import { useSelector } from 'react-redux';

const CharacterHeader = (props: Props) => {
	const characterToEdit = useSelector(selectEditingCharacter);
	if (characterToEdit) {
		return <CharacterHeaderEdit {...props} />;
	}
	return <CharacterHeaderView {...props} />;
};

export default CharacterHeader;
