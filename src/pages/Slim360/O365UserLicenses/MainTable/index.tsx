import { Popconfirm } from 'antd';
import _ from 'lodash';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import {
  setTableColumnSelection,
  clearSlim360O365UserLicensesMessages,
  slim360O365UserLicensesSelector,
} from '../../../../store/slim360/o365UserLicenses/o365UserLicenses.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteSlim360O365UserLicenses,
  searchSlim360O365UserLicenses,
} from '../../../../store/slim360/o365UserLicenses/o365UserLicenses.action';
import slim360O365UserLicensesService from '../../../../services/slim360/o365UserLicenses/o365UserLicenses.service';
import {
  FilterByDateSwap,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { showDateFromApi } from '../../../../common/helperFunction';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const slim360O365UserLicenses = useAppSelector(slim360O365UserLicensesSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();
  const globalFilters = useAppSelector(globalSearchSelector);
  const [ObjectForColumnFilter, setObjectForColumnFilter] = useState({});

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  useEffect(() => {
    if (isMultiple) {
      dataTableRef?.current.getValuesForSelection();
    }
  }, [isMultiple]);

  const exportExcelFile = (searchData: ISearch) => {
    return slim360O365UserLicensesService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      slim360O365UserLicenses.search.tableName,
      form,
      null,
      ObjectForColumnFilter
    );
  };

  const FilterByDateSwapTable = (dataIndex: string, tableName: string, form: any) => {
    return FilterByDateSwap(dataIndex, tableName, form, null, ObjectForColumnFilter);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: <span className="dragHandler">ID</span>,
        column: 'id',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('id', form),
            dataIndex: 'id',
            key: 'id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Tenant Name</span>,
        column: 'TenantId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'tenant_id',
              slim360O365UserLicenses.search.lookups?.tenants?.length > 0
                ? slim360O365UserLicenses.search.lookups?.tenants
                : globalFilters?.globalTenantLookup?.data
            ),
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Company Name</span>,
        column: 'CompanyId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'company_id',
              slim360O365UserLicenses.search.lookups?.companies?.length > 0
                ? slim360O365UserLicenses.search.lookups?.companies
                : globalFilters?.globalCompanyLookup?.data
            ),
            dataIndex: 'company_name',
            key: 'company_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Bu Name</span>,
        column: 'BU_Id',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'bu_id',
              slim360O365UserLicenses.search.lookups?.bus?.length > 0
                ? slim360O365UserLicenses.search.lookups?.bus
                : globalFilters?.globalBULookup?.data
            ),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Azure Tenant Id</span>,
        column: 'azureTenantId',
        sorter: true,
        children: [
          {
            title: FilterBySwap('azure_tenant_id', form),
            dataIndex: 'azure_tenant_id',
            key: 'azure_tenant_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Date Added</span>,
        column: 'Date Added',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable(
              'date_added',
              slim360O365UserLicenses.search.tableName,
              form
            ),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">User Principal Name</span>,
        column: 'userPrincipalName',
        sorter: true,
        children: [
          {
            title: FilterBySwap('user_principal_name', form),
            dataIndex: 'user_principal_name',
            key: 'user_principal_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Assigned Licenses</span>,
        column: 'assignedLicenses',
        sorter: true,
        children: [
          {
            title: FilterBySwap('assigned_licenses', form),
            dataIndex: 'assigned_licenses',
            key: 'assigned_licenses',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeSlim360O365UserLicenses = (id: number) => {
    dispatch(deleteSlim360O365UserLicenses(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.Slim360O365UserLicenses}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/slim360/slim360-o365-user-licenses/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.Slim360O365UserLicenses}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeSlim360O365UserLicenses(data.id)}>
          <a href="#" title="" className="action-btn">
            <img src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`} alt="" />
          </a>
        </Popconfirm>
      </Can>
    </div>
  );

  return (
    <>
      <DataTable
        ref={dataTableRef}
        showAddButton={ability.can(Action.Add, Page.Slim360O365UserLicenses)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={slim360O365UserLicensesSelector}
        searchTableData={searchSlim360O365UserLicenses}
        clearTableDataMessages={clearSlim360O365UserLicensesMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.Slim360O365UserLicenses)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
