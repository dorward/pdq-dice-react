import { Props } from './types';
import AttributesEdit from './attributes-edit';
import AttributesPlay from './attributes-play';
import React from 'react';

import { selectEditingCharacter } from '../../data/edit-mode-slice';
import { useSelector } from 'react-redux';

const Attributes = (props: Props) => {
	const characterToEdit = useSelector(selectEditingCharacter);
	const Component = characterToEdit ? AttributesEdit : AttributesPlay;
	const character = characterToEdit ?? props.character;
	return <Component {...{ ...props, character }} />;
};

export default Attributes;
