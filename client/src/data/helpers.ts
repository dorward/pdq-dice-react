import { addCharacterFromScratch, updateCharacter } from '../data/user-slice';
import { exitEditMode } from '../data/edit-mode-slice';
import { setCharacterId } from '../data/whoami-slice';
import { v4 as uuidv4 } from 'uuid';
import store from '../data/redux-store';

export const finishEditing = () => {
	store.dispatch(updateCharacter(store.getState().editMode));
	store.dispatch(exitEditMode());
};

export const createNewCharacter = () => {
	const id = uuidv4();
	store.dispatch(addCharacterFromScratch(id));
	store.dispatch(setCharacterId(id));
};
