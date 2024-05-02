import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { ITabVHost } from '../../../services/rvTools/tabVHost/tabVHost.model';
import { RootState } from '../../app.model';
import { searchTabVHost, getTabVHostById, saveTabVHost, deleteTabVHost } from './tabVHost.action';
import { ITabVHostState } from './tabVHost.model';

export const initialState: ITabVHostState = {
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

export const tabVHostSlice = createSlice({
  name: 'tabVHost',
  initialState,
  reducers: {
    clearTabVHost: () => {
      return initialState;
    },
    clearTabVHostMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearTabVHostGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchTabVHost.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchTabVHost.fulfilled.type]: (state, action: PayloadAction<ISearchResponse<ITabVHost>>) => {
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
    [searchTabVHost.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getTabVHostById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getTabVHostById.fulfilled.type]: (state, action: PayloadAction<ITabVHost>) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getTabVHostById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveTabVHost.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveTabVHost.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveTabVHost.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteTabVHost.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteTabVHost.fulfilled.type]: (state, action: PayloadAction<IApiResponseBody<unknown>>) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteTabVHost.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const tabVHostSelector = (state: RootState) => state.tabVHost;

// Actions
export const {
  clearTabVHost,
  clearTabVHostMessages,
  clearTabVHostGetById,
  setTableColumnSelection,
} = tabVHostSlice.actions;

// The reducer
export default tabVHostSlice.reducer;
