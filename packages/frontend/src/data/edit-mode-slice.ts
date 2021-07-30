import {
	Attribute,
	AttributeUpdate,
	AttributeUpdateValue,
	Character,
	Extra,
	ExtraUpdate,
	isExtraUpdateValue,
} from '../types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './redux-store';
import { mutateName, mutateValue } from './edit-mode-helpers';
import { v4 as uuidv4 } from 'uuid';

type EditModeState = null | Character;

const initialEditModeState: EditModeState = null;

// TODO: Figure out why I can't export this from types/index.ts
export const isAttributeUpdateValue = (data: AttributeUpdate): data is AttributeUpdateValue => 'value' in data;

const EditModeSlice = createSlice({
	name: 'EditMode',
	initialState: initialEditModeState,
	reducers: {
		editCharacter: (state: EditModeState, action: PayloadAction<Character>) => action.payload,
		updateAttribute: (state: EditModeState, action: PayloadAction<AttributeUpdate>) => {
			if (isAttributeUpdateValue(action.payload)) {
				if (action.payload.value === 'DEL') {
					state.qualities = state.qualities.filter(q => q.id !== action.payload.id);
					state.powers = state.powers.filter(q => q.id !== action.payload.id);
					return state;
				}
				state.qualities = mutateValue(state.qualities, action.payload.id, action.payload.value) as Attribute[];
				state.powers = mutateValue(state.powers, action.payload.id, action.payload.value) as Attribute[];
			} else {
				state.qualities = mutateName(state.qualities, action.payload.id, action.payload.name) as Attribute[];
				state.powers = mutateName(state.powers, action.payload.id, action.payload.name) as Attribute[];
			}
			return state;
		},
		addAttribute: (state: EditModeState, action: PayloadAction<'quality' | 'power'>) => {
			const prop = action.payload === 'quality' ? 'qualities' : 'powers';
			state[prop] = [
				...state[prop],
				{
					id: uuidv4(),
					name: `New ${action.payload}`,
					value: 'AVG',
					wounds: 0,
				},
			];
			return state;
		},
		updateExtra: (state: EditModeState, action: PayloadAction<ExtraUpdate>) => {
			if (isExtraUpdateValue(action.payload)) {
				const { value } = action.payload;
				if (value === 'DEL') {
					state.extras = state.extras.filter(q => q.id !== action.payload.id);
				} else {
					state.extras = mutateValue(state.extras, action.payload.id, action.payload.value) as Extra[];
				}
			} else {
				state.extras = mutateName(state.extras, action.payload.id, action.payload.name) as Extra[];
			}
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
	addExtra,
	addAttribute,
	editCharacter,
	exitEditMode,
	updateCurrentBennies,
	updateExtra,
	updateMaximumBennies,
	updateName,
	updateAttribute,
} = EditModeSlice.actions;
export const selectEditingCharacter = (state: RootState) => state.editMode;
export default EditModeSlice.reducer;
