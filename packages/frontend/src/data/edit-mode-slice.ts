import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './redux-store';
import { Character } from '../types';

type EditModeState = null | Character;

const initialEditModeState: EditModeState = null;

const EditModeSlice = createSlice({
	name: 'EditMode',
	initialState: initialEditModeState,
	reducers: {
		editCharacter: (state: EditModeState, action: PayloadAction<Character>) => action.payload,
		cancelEdit: (state: EditModeState) => null,
		saveEdit: (state: EditModeState) => (alert('Not yet implemented'), state),
	},
});

export const { editCharacter, cancelEdit } = EditModeSlice.actions;
export const selectEditingCharacter = (state: RootState) => state.editMode;
export default EditModeSlice.reducer;
