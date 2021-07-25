import { Props } from './types';
import AttributesEdit from './attributes-edit';
import AttributesPlay from './attributes-play';
import React from 'react';

import { selectEditingCharacter } from '../../data/edit-mode-slice';
import { useSelector } from 'react-redux';

const Attributes = (props: Props) => {
	const characterToEdit = useSelector(selectEditingCharacter);
	const Component = characterToEdit ? AttributesEdit : AttributesPlay;
	return <Component {...props} />;
};

export default Attributes;
