import { Props } from './types';
import ExtrasEdit from './extras-edit';
import ExtrasPlay from './extras-play';
import React from 'react';

import { selectEditingCharacter } from '../../data/edit-mode-slice';
import { useSelector } from 'react-redux';

const Extras = (props: Props) => {
	const characterToEdit = useSelector(selectEditingCharacter);
	const Component = characterToEdit ? ExtrasEdit : ExtrasPlay;
	return <Component {...props} />;
};

export default Extras;
