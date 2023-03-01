import { Props } from './types';
import ExtrasEdit from './extras-edit';
import ExtrasPlay from './extras-play';

import { selectEditingCharacter } from '../../data/edit-mode-slice';
import { useSelector } from 'react-redux';

const Extras = (props: Props) => {
	const characterToEdit = useSelector(selectEditingCharacter);
	if (characterToEdit) {
		return <ExtrasEdit {...props} />;
	}
	if (props.extras.length) {
		return <ExtrasPlay {...props} />;
	}
	return <p>No extras for you</p>;
};

export default Extras;
