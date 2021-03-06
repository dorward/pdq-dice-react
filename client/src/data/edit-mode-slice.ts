import { AttributeUpdate, Character, ExtraUpdate, SelectExtra } from '../types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './redux-store';
import { isAttributeUpdateValue, isExtraUpdateLocation, isExtraUpdateValue, isExtraUpdateCount } from '../types/guard';
import { mutateLocation, mutateName, mutateValue, mutateCount } from './edit-mode-helpers';
import { v4 as uuidv4 } from 'uuid';

type SelectedExtra = {
	selectedExtraId?: string;
};

type EditModeState = null | (Character & SelectedExtra);

const initialEditModeState: EditModeState = null;

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
				state.qualities = mutateValue(state.qualities, action.payload.id, action.payload.value);
				state.powers = mutateValue(state.powers, action.payload.id, action.payload.value);
			} else {
				state.qualities = mutateName(state.qualities, action.payload.id, action.payload.name);
				state.powers = mutateName(state.powers, action.payload.id, action.payload.name);
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
					state.extras = mutateValue(state.extras, action.payload.id, action.payload.value);
				}
			} else if (isExtraUpdateLocation(action.payload)) {
				state.extras = mutateLocation(state.extras, action.payload.id, action.payload.location);
			} else if (isExtraUpdateCount(action.payload)) {
				state.extras = mutateCount(state.extras, action.payload.id, action.payload.count);
			} else {
				state.extras = mutateName(state.extras, action.payload.id, action.payload.name);
			}
			return state;
		},
		promptExtraCount: (state: EditModeState, action: PayloadAction<SelectExtra>) => {
			const { id } = action.payload;
			return { ...state, selectedExtraId: id };
		},
		addExtra: (state: EditModeState) => {
			state.extras = [
				...state.extras,
				{
					id: uuidv4(),
					name: 'New extra',
					value: 0,
					location: '',
				},
			];
			return state;
		},
		updateAvatar: (state: EditModeState, action: PayloadAction<string>) => {
			state.avatar = action.payload;
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
	updateAvatar,
	updateCurrentBennies,
	updateExtra,
	updateMaximumBennies,
	updateName,
	updateAttribute,
	promptExtraCount,
} = EditModeSlice.actions;
export const selectEditingCharacter = (state: RootState) => state.editMode;
export const selectLocations = (state: RootState) =>
	state.editMode.extras
		.map(extra => extra.location)
		.filter(location => location !== '')
		.filter((location, index, array) => array.indexOf(location) === index)
		.sort();
export default EditModeSlice.reducer;
