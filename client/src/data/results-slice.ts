import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './redux-store';

type ResultsState = {
	loading: boolean;
	roll: {
		results: { name: string; value: string }[];
		total: number;
		success?: boolean;
	};
};

const initialResultsState: ResultsState = { loading: false, roll: null };

const resultsSlice = createSlice({
	name: 'results',
	initialState: initialResultsState,
	reducers: {
		markClear: state => {
			state.loading = false;
			state.roll = null;
		},
		markLoading: state => {
			state.loading = true;
			state.roll = null;
		},
		setResult: (state, action: PayloadAction<ResultsState['roll']>) => {
			state.loading = false;
			state.roll = action.payload;
		},
	},
});

export const { markClear, markLoading, setResult } = resultsSlice.actions;
export const selectResults = (state: RootState) => state.results;
export default resultsSlice.reducer;
