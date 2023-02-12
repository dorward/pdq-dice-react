import { selectEditingCharacter } from '../../data/edit-mode-slice';
import { useSelector } from 'react-redux';
import CharacterHeaderEdit from './character-header-edit';
import CharacterHeaderView from './character-header-view';
import type { Props } from './character-header-types';

const CharacterHeader = (props: Props) => {
	const characterToEdit = useSelector(selectEditingCharacter);
	console.log('character header', { characterToEdit });
	if (characterToEdit) {
		return <CharacterHeaderEdit {...props} />;
	}
	return <CharacterHeaderView {...props} />;
};

export default CharacterHeader;
