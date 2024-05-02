import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { RootState } from '../../app.model';
import {
  deleteAdUsersExclusion,
  getAdUsersExclusionById,
  getAdUsersExclusionsFieldLookup,
  saveAdUsersExclusion,
  searchAdUsersExclusion,
} from './adUsersExclusions.action';
import { IAdUsersExclusionsState } from './adUsersExclusions.model';
import { IAdUsersExclusions } from '../../../services/ad/adUsersExclusions/adUsersExclusions.model';
import { ILookup } from '../../../services/common/common.model';

export const initialState: IAdUsersExclusionsState = {
  search: {
    loading: false,
    hasErrors: false,
    data: [],
    count: 0,
    lookups: {},
    tableName: '',
  },
  tableColumnSelection: {
    id: null,
    table_name: null,
    columns: {},
  },
  getById: {
    loading: false,
    hasErrors: false,
    data: null,
  },
  fieldLookup: {
    data: [],
    loading: false,
  },
  save: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
  delete: {
    loading: false,
    hasErrors: false,
    messages: [],
  },
};

export const adUsersExclusionsSlice = createSlice({
  name: 'adUsersExclusions',
  initialState,
  reducers: {
    clearAdUsersExclusion: () => {
      return initialState;
    },
    clearAdUsersExclusionMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearAdUsersExclusionGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchAdUsersExclusion.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchAdUsersExclusion.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<IAdUsersExclusions>>
    ) => {
      const { search_result, ...rest } = action.payload;
      state.search.data = search_result.records;
      state.search.count = search_result.total_count;
      if (JSON.stringify(rest) !== '{}') {
        state.search.lookups = { ...rest, booleanLookup };
      }
      state.search.loading = false;
      state.search.hasErrors = false;
      state.search.tableName = search_result.table_name;
      if (search_result.column_selection) {
        state.tableColumnSelection.id = search_result.column_selection.id;
        const tableSelectionObj = JSON.parse(search_result.column_selection.columns as any);
        if (tableSelectionObj.columns) {
          state.tableColumnSelection.column_orders = tableSelectionObj.column_orders;
          state.tableColumnSelection.columns = tableSelectionObj.columns;
        } else {
          state.tableColumnSelection.columns = tableSelectionObj;
        }
      }
      state.tableColumnSelection.table_name = search_result.table_name;
    },
    [searchAdUsersExclusion.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    //Field Lookoup
    [getAdUsersExclusionsFieldLookup.pending.type]: (state) => {
      state.fieldLookup.loading = true;
    },
    [getAdUsersExclusionsFieldLookup.fulfilled.type]: (state, action: PayloadAction<ILookup[]>) => {
      state.fieldLookup.data = action.payload;
      state.fieldLookup.loading = false;
    },

    // Get by id
    [getAdUsersExclusionById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getAdUsersExclusionById.fulfilled.type]: (
      state,
      action: PayloadAction<IAdUsersExclusions>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getAdUsersExclusionById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveAdUsersExclusion.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveAdUsersExclusion.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveAdUsersExclusion.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteAdUsersExclusion.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteAdUsersExclusion.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteAdUsersExclusion.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const adUsersExclusionsSelector = (state: RootState) => state.adUsersExclusions;

// Actions
export const {
  clearAdUsersExclusion,
  clearAdUsersExclusionMessages,
  clearAdUsersExclusionGetById,
  setTableColumnSelection,
} = adUsersExclusionsSlice.actions;

// The reducer
export default adUsersExclusionsSlice.reducer;
