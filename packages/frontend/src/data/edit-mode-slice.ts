import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './redux-store';
import { Character, QualityValue } from '../types';
import { v4 as uuidv4 } from 'uuid';

type EditModeState = null | Character;

const initialEditModeState: EditModeState = null;

type AttributeUpdate = {
	id: string;
	value: QualityValue;
};

type ExtraUpdate = {
	id: string;
	value: number;
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
		updateExtra: (state: EditModeState, action: PayloadAction<ExtraUpdate>) => {
			const extraToUpdate = state.extras.find(q => q.id === action.payload.id);
			extraToUpdate.value = action.payload.value;
			return state;
		},
		addExtra: (state: EditModeState, action: PayloadAction) => {
			state.extras = [
				...state.extras,
				{
					id: uuidv4(),
					name: 'New extra',
					value: 0,
				},
			];
			return state;
		},
		updateName: (state: EditModeState, action: PayloadAction<string>) => {
			state.name = action.payload;
			return state;
		},
		exitEditMode: (state: EditModeState) => null,
	},
});

export const { editCharacter, exitEditMode, updateQuality, updateName, updateExtra, addExtra } = EditModeSlice.actions;
export const selectEditingCharacter = (state: RootState) => state.editMode;
export default EditModeSlice.reducer;
