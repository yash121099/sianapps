import { booleanLookup } from '../../../common/constants/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiResponseBody, ISearchResponse } from '../../../common/models/common';
import { RootState } from '../../app.model';
import { ICmsContractAgreementState } from './contractAgreement.model';
import {
  deleteCmsContractAgreement,
  getCmsContractAgreementById,
  saveCmsContractAgreement,
  searchCmsContractAgreement,
} from './contractAgreement.action';
import { ICmsContractAgreement } from '../../../services/cms/contractAgreement/contractAgreement.model';

export const initialState: ICmsContractAgreementState = {
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

export const cmsContractAgreementSlice = createSlice({
  name: 'cmsContractAgreement',
  initialState,
  reducers: {
    clearCmsContractAgreement: () => {
      return initialState;
    },
    clearCmsContractAgreementMessages: (state) => {
      state.save.messages = [];
      state.delete.messages = [];
    },
    clearCmsContractAgreementGetById: (state) => {
      state.getById.data = null;
    },
    setTableColumnSelection: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
      state.tableColumnSelection.columns = action.payload;
    },
  },
  extraReducers: {
    // Search
    [searchCmsContractAgreement.pending.type]: (state) => {
      state.search.loading = true;
    },
    [searchCmsContractAgreement.fulfilled.type]: (
      state,
      action: PayloadAction<ISearchResponse<ICmsContractAgreement>>
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
    [searchCmsContractAgreement.rejected.type]: (state) => {
      state.search.loading = false;
      state.search.hasErrors = true;
    },

    // Get by id
    [getCmsContractAgreementById.pending.type]: (state) => {
      state.getById.loading = true;
    },
    [getCmsContractAgreementById.fulfilled.type]: (
      state,
      action: PayloadAction<ICmsContractAgreement>
    ) => {
      state.getById.data = action.payload;
      state.getById.loading = false;
      state.getById.hasErrors = false;
    },
    [getCmsContractAgreementById.rejected.type]: (state) => {
      state.getById.loading = false;
      state.getById.hasErrors = true;
    },

    // Save
    [saveCmsContractAgreement.pending.type]: (state) => {
      state.save.loading = true;
      state.save.messages = [];
    },
    [saveCmsContractAgreement.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.save.loading = false;
      state.save.hasErrors = false;
      state.save.messages = action.payload.messages;
    },
    [saveCmsContractAgreement.rejected.type]: (state) => {
      state.save.loading = false;
      state.save.hasErrors = true;
    },

    // Delete
    [deleteCmsContractAgreement.pending.type]: (state) => {
      state.delete.loading = true;
      state.delete.messages = [];
    },
    [deleteCmsContractAgreement.fulfilled.type]: (
      state,
      action: PayloadAction<IApiResponseBody<unknown>>
    ) => {
      state.delete.loading = false;
      state.delete.hasErrors = false;
      state.delete.messages = action.payload.messages;
    },
    [deleteCmsContractAgreement.rejected.type]: (state) => {
      state.delete.loading = false;
      state.delete.hasErrors = true;
    },
  },
});

// A selector
export const cmsContractAgreementSelector = (state: RootState) => state.cmsContractAgreement;

// Actions
export const {
  clearCmsContractAgreement,
  clearCmsContractAgreementMessages,
  clearCmsContractAgreementGetById,
  setTableColumnSelection,
} = cmsContractAgreementSlice.actions;

// The reducer
export default cmsContractAgreementSlice.reducer;
