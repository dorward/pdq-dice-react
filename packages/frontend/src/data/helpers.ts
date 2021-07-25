import { exitEditMode } from '../data/edit-mode-slice';
import { updateCharacter } from '../data/user-slice';
import store from '../data/redux-store';

export const finishEditing = () => {
	console.log('Finish editing');
	store.dispatch(updateCharacter(store.getState().editMode));
	store.dispatch(exitEditMode());
};
