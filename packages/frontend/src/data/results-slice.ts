import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './redux-store';

type ResultsState = {
	loading: boolean;
	roll: null | number;
};

const initialResultsState: ResultsState = { loading: false, roll: null };

const resultsSlice = createSlice({
	name: 'results',
	initialState: initialResultsState,
	reducers: {
		markClear: (state, action: PayloadAction) => {
			state.loading = false;
			state.roll = null;
		},
		markLoading: (state, action: PayloadAction) => {
			state.loading = true;
			state.roll = null;
		},
		setResult: (state, action: PayloadAction<number>) => {
			state.loading = false;
			state.roll = action.payload;
		},
	},
});

export const { markClear, markLoading, setResult } = resultsSlice.actions;
export const selectResults = (state: RootState) => state.results;
export default resultsSlice.reducer;
