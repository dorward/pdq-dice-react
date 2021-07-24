import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './redux-store';
import { Character, QualityValue } from '../types';

type EditModeState = null | Character;

const initialEditModeState: EditModeState = null;

type AttributeUpdate = {
	id: string;
	value: QualityValue;
};

const EditModeSlice = createSlice({
	name: 'EditMode',
	initialState: initialEditModeState,
	reducers: {
		editCharacter: (state: EditModeState, action: PayloadAction<Character>) => action.payload,
		updateQuality: (state: EditModeState, action: PayloadAction<AttributeUpdate>) => {
			const qualityToUpdate = [...state.qualities, ...state.powers].find(q => q.id === action.payload.id);
			qualityToUpdate.value = action.payload.value;
			return state;
		},
		updateName: (state: EditModeState, action: PayloadAction<string>) => {
			state.name = action.payload;
			return state;
		},
		exitEditMode: (state: EditModeState) => null,
	},
});

export const { editCharacter, exitEditMode, updateQuality, updateName } = EditModeSlice.actions;
export const selectEditingCharacter = (state: RootState) => state.editMode;
export default EditModeSlice.reducer;
