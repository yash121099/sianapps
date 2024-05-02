import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { booleanLookup } from '../../../common/constants/common';
import { IConfigExclusionOperationState } from './exclusionOperation.model';
import {
  deleteConfigExclusionOperation,
  getConfigExclusionOperationById,
  saveConfigExclusionOperation,
  searchConfigExclusionOperation,
} from './exclusionOperation.action';
import { IConfigExclusionOperation } from '../../../services/master/exclusionOperation/exclusionOperation.model';

export const initialState: IConfigExclusionOperationState = {
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

export const configExclusionOperationSlice = createSlice({
  name: 'configExclusionOperation',
  initialState,
  reducers: {
    clearConfigExclusionOperation: () => {
      return initialState;
    },
    clearConfigExclusionOperationMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearConfigExclusionOperationGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchConfigExclusionOperation.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchConfigExclusionOperation.fulfilled.type]: (state, action: PayloadAction<any>) => {
      const { records, total_count, table_name, column_selection } = action.payload;
      state.search.data = records;
      state.search.count = total_count;
      state.search.lookups = { booleanLookup };
      state.search.loading = false;
      state.search.hasErrors = false;
      state.search.tableName = table_name;
      if (column_selection) {
        state.tableColumnSelection.id = column_selection.id;
        const tableSelectionObj = JSON.parse(column_selection.columns as any);
        if (tableSelectionObj.columns) {
          state.tableColumnSelection.column_orders = tableSelectionObj.column_orders;
          state.tableColumnSelection.columns = tableSelectionObj.columns;
        } else {
          state.tableColumnSelection.columns = tableSelectionObj;
        }
      }
      state.tableColumnSelection.table_name = table_name;
    },
    [searchConfigExclusionOperation.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getConfigExclusionOperationById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getConfigExclusionOperationById.fulfilled.type]: (
      state,
      action: PayloadAction<IConfigExclusionOperation>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getConfigExclusionOperationById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveConfigExclusionOperation.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveConfigExclusionOperation.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveConfigExclusionOperation.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteConfigExclusionOperation.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteConfigExclusionOperation.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteConfigExclusionOperation.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const configExclusionOperationSelector = (state: RootState) =>
  state.configExclusionOperation;

// Actions
export const {
  clearConfigExclusionOperation,
  clearConfigExclusionOperationMessages,
  clearConfigExclusionOperationGetById,
  setTableColumnSelection,
} = configExclusionOperationSlice.actions;

// The reducer
export default configExclusionOperationSlice.reducer;
