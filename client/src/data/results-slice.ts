import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './redux-store';

type ResultsState = {
    loading: boolean;
    error: string | null;
    roll: {
        results: { name: string; value: string }[];
        total: number;
        rollType?: string;
        success?: boolean;
    };
};

const initialResultsState: ResultsState = { loading: false, roll: null, error: null };

const resultsSlice = createSlice({
    name: 'results',
    initialState: initialResultsState,
    reducers: {
        markClear: (state) => {
            state.error = null;
            state.loading = false;
            state.roll = null;
        },
        markLoading: (state) => {
            state.error = null;
            state.loading = true;
            state.roll = null;
        },
        setRollError: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.roll = null;
            state.error = action.payload;
        },
        setResult: (state, action: PayloadAction<ResultsState['roll']>) => {
            state.error = null;
            state.loading = false;
            state.roll = action.payload;
        },
    },
});

export const { markClear, markLoading, setResult, setRollError } = resultsSlice.actions;
export const selectResults = (state: RootState) => state.results;
export default resultsSlice.reducer;
