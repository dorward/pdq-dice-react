import { Character, ExtraUpdate, QualityValue, isExtraUpdateValue } from '../types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './redux-store';
import { v4 as uuidv4 } from 'uuid';

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
		updateExtra: (state: EditModeState, action: PayloadAction<ExtraUpdate>) => {
			const extraToUpdate = state.extras.find(q => q.id === action.payload.id);
			if (isExtraUpdateValue(action.payload)) extraToUpdate.value = action.payload.value;
			else extraToUpdate.name = action.payload.name;
			return state;
		},
		addExtra: (state: EditModeState) => {
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
		updateCurrentBennies: (state: EditModeState, action: PayloadAction<number>) => {
			state.bennies.current = action.payload;
			return state;
		},
		updateMaximumBennies: (state: EditModeState, action: PayloadAction<string>) => {
			state.bennies.max = action.payload;
			return state;
		},
		exitEditMode: () => null,
	},
});

export const {
	editCharacter,
	exitEditMode,
	updateQuality,
	updateName,
	updateExtra,
	addExtra,
	updateCurrentBennies,
	updateMaximumBennies,
} = EditModeSlice.actions;
export const selectEditingCharacter = (state: RootState) => state.editMode;
export default EditModeSlice.reducer;
