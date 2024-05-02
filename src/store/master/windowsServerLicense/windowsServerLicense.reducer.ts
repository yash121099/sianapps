import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { IConfigWindowsServerLicenseState } from './windowsServerLicense.model';
import {
  deleteConfigWindowsServerLicense,
  getConfigWindowsServerLicenseById,
  saveConfigWindowsServerLicense,
  searchConfigWindowsServerLicense,
} from './windowsServerLicense.action';
import { IConfigWindowsServerLicense } from '../../../services/master/windowsServerLicense/windowsServerLicense.model';

export const initialState: IConfigWindowsServerLicenseState = {
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

export const configWindowsServerLicenseSlice = createSlice({
  name: 'configWindowsServerLicense',
  initialState,
  reducers: {
    clearConfigWindowsServerLicense: () => {
      return initialState;
    },
    clearConfigWindowsServerLicenseMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearConfigWindowsServerLicenseGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchConfigWindowsServerLicense.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchConfigWindowsServerLicense.fulfilled.type]: (state, action: PayloadAction<any>) => {
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
    [searchConfigWindowsServerLicense.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getConfigWindowsServerLicenseById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getConfigWindowsServerLicenseById.fulfilled.type]: (
      state,
      action: PayloadAction<IConfigWindowsServerLicense>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getConfigWindowsServerLicenseById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveConfigWindowsServerLicense.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveConfigWindowsServerLicense.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveConfigWindowsServerLicense.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteConfigWindowsServerLicense.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteConfigWindowsServerLicense.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteConfigWindowsServerLicense.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const configWindowsServerLicenseSelector = (state: RootState) =>
  state.configWindowsServerLicense;

// Actions
export const {
  clearConfigWindowsServerLicense,
  clearConfigWindowsServerLicenseMessages,
  clearConfigWindowsServerLicenseGetById,
  setTableColumnSelection,
} = configWindowsServerLicenseSlice.actions;

// The reducer
export default configWindowsServerLicenseSlice.reducer;
