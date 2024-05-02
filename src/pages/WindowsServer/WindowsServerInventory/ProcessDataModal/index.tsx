import { Button, Col, Form, Modal, Row, Select, Switch } from 'antd';
import React, { useEffect } from 'react';
import {
  IConfigModelPopUpDataSelection,
  IGetConfigModelPopUpDataSelection,
  ILookup,
} from '../../../../services/common/common.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  configModelPopUpDataSelection,
  getAllCompanyLookup,
  getBULookup,
  getConfigModelPopUpDataSelection,
  getConfigWindowsServerVersionsLookup,
  getScheduleDate,
} from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearConfigModelPopUpDataSelection,
  clearDateLookup,
  cleargetModelPopUpDataSelection,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { IProcessDataModalProps } from './processData.model';
import { processDataWindowsServerInventory } from '../../../../store/windowsServer/windowsServerInventory/windowsServerInventory.action';
import {
  clearWindowsServerInventoryMessages,
  windowsServerInventorySelector,
} from '../../../../store/windowsServer/windowsServerInventory/windowsServerInventory.reducer';
import { toast } from 'react-toastify';
import { Common, validateMessages } from '../../../../common/constants/common';
import { getandReturn, getScheduleDateHelperLookup } from '../../../../common/helperFunction';
import _ from 'lodash';
import { IInlineSearch } from '../../../../common/models/common';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import { clearConfigWindowsServerVersions } from '../../../../store/master/windowsServerVersions/windowsServerVersions.reducer';

const { Option } = Select;

const ProcessDataModal: React.FC<IProcessDataModalProps> = (props) => {
  const windowsServerInventory = useAppSelector(windowsServerInventorySelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { showModal, handleModalClose, filterKeys, tableName } = props;

  const [form] = Form.useForm();

  const initialValues = {
    company_id: null,
    bu_id: null,
    date_added: null,
    set_device_states: false,
    set_device_states_inc_non_prod: false,
    set_device_states_by_keyword: false,
    x_ref_ad: false,
    x_ref_azure: false,
    sc_version_apply_all: false,
    sc_version_id: null,
    update_rv_tools_vm: false,
    update_rv_tools_host: false,
    apply_overrides: false,
  };

  const onFinish = (values: any) => {
    dispatch(processDataWindowsServerInventory(values));
  };

  const saveConfig = () => {
    const globalSearch: IInlineSearch = {};
    for (const key in globalFilters.search) {
      const element = globalFilters.search[key];
      globalSearch[key] = element ? [element] : null;
    }
    const fieldValues = { ...form.getFieldsValue() };
    delete fieldValues.date_added;
    const setModelSelection: IConfigModelPopUpDataSelection = {
      id:
        commonLookups.getModelPopUpSelection.id === null
          ? null
          : commonLookups.getModelPopUpSelection.id,
      selection: JSON.stringify(fieldValues),
      table_name: tableName,
      pop_up_name: 'ProcessDataSet',
      company_id: form.getFieldValue('company_id'),
      bu_id: form.getFieldValue('bu_id'),
    };
    dispatch(configModelPopUpDataSelection(setModelSelection));
  };

  const getConfigData = async (data: any) => {
    if (data.company_id) {
      await dispatch(getBULookup(data.company_id));
    }
    if (data.bu_id) {
      await dispatch(
        getScheduleDate(getScheduleDateHelperLookup(form.getFieldsValue(), tableName))
      );
    }
    form.setFieldsValue(data);
  };

  useEffect(() => {
    if (windowsServerInventory.processData.messages.length > 0) {
      if (windowsServerInventory.processData.hasErrors) {
        toast.error(windowsServerInventory.processData.messages.join(' '));
      } else {
        toast.warning(windowsServerInventory.processData.messages.join(' '));
        handleModalClose();
      }
      dispatch(clearWindowsServerInventoryMessages());
    }
  }, [windowsServerInventory.processData.messages]);

  const handleCompanyChange = (companyId: number) => {
    form.setFieldsValue({ company_id: companyId, bu_id: null });
    dispatch(clearDateLookup());
    if (companyId) {
      dispatch(getBULookup(companyId));
    } else {
      dispatch(clearBULookUp());
    }
  };

  const handleBUChange = (buId: number) => {
    if (buId) {
      dispatch(
        getScheduleDate(
          getScheduleDateHelperLookup(
            form.getFieldsValue(),
            windowsServerInventory.search.tableName
          )
        )
      );
    } else {
      dispatch(clearDateLookup());
    }
    form.setFieldsValue({ bu_id: buId });
  };

  useEffect(() => {
    dispatch(getAllCompanyLookup());
    return () => {
      dispatch(clearBULookUp());
      dispatch(clearDateLookup());
    };
  }, [dispatch]);

  useEffect(() => {
    if (commonLookups.getModelPopUpSelection.data !== {}) {
      getConfigData(commonLookups.getModelPopUpSelection.data);
    }
  }, [commonLookups.getModelPopUpSelection.data]);

  useEffect(() => {
    if (commonLookups.setModelPopUpSelection.messages.length > 0) {
      if (commonLookups.setModelPopUpSelection.hasErrors) {
        toast.error(commonLookups.setModelPopUpSelection.messages.join(' '));
      } else {
        toast.success(commonLookups.setModelPopUpSelection.messages.join(' '));
      }
      dispatch(clearConfigModelPopUpDataSelection());
    }
  }, [commonLookups.setModelPopUpSelection.messages]);

  React.useEffect(() => {
    dispatch(getConfigWindowsServerVersionsLookup());
    const globalSearch: IInlineSearch = {};
    for (const key in globalFilters.search) {
      const element = globalFilters.search[key];
      globalSearch[key] = element ? [element] : null;
    }
    if (ability.can(Action.ModelDataSeletion, Page.ConfigModelPopUpSelection)) {
      const modelPopUp: IGetConfigModelPopUpDataSelection = {
        table_name: tableName,
        pop_up_name: 'ProcessDataSet',
        tenant_id:
          _.isNull(globalSearch.tenant_id) || !globalSearch.tenant_id
            ? null
            : globalSearch.tenant_id[0],
        company_id:
          _.isNull(globalSearch.company_id) || !globalSearch.company_id
            ? null
            : globalSearch.company_id[0],
        bu_id: _.isNull(globalSearch.bu_id) || !globalSearch.bu_id ? null : globalSearch.bu_id[0],
      };
      if (globalSearch.company_id && globalSearch.company_id[0] !== 0)
        dispatch(getConfigModelPopUpDataSelection(modelPopUp));
    }
    if (
      globalFilters.search.company_id ||
      Object.keys(commonLookups.getModelPopUpSelection.data).length == 0
    ) {
      if (globalSearch.company_id) dispatch(getBULookup(globalSearch.company_id[0]));
      const filterValues = {
        company_id:
          _.isNull(globalSearch.company_id) || !globalSearch.company_id
            ? null
            : globalSearch.company_id[0],
        bu_id: _.isNull(globalSearch.bu_id) || !globalSearch.bu_id ? null : globalSearch.bu_id[0],
        date_added:
          filterKeys?.filter_keys?.date_added?.length === 1
            ? getandReturn(filterKeys.filter_keys.date_added[0]).format('YYYY-MM-DD')
            : null,
      };
      if (globalFilters.search.company_id || filterKeys?.filter_keys?.date_added?.length === 1) {
        dispatch(
          getScheduleDate(
            getScheduleDateHelperLookup(filterValues, windowsServerInventory.search.tableName)
          )
        );
      }
      form.setFieldsValue(filterValues);
    }
    return () => {
      dispatch(cleargetModelPopUpDataSelection());
      dispatch(clearWindowsServerInventoryMessages());
      dispatch(clearConfigWindowsServerVersions());
    };
  }, []);

  return (
    <>
      <Modal
        wrapClassName="custom-modal"
        title="Process Data"
        centered
        visible={showModal}
        onCancel={handleModalClose}
        footer={false}
      >
        <Form
          form={form}
          name="processData"
          initialValues={initialValues}
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Row gutter={[30, 15]} className="form-label-hide">
            <Col xs={24} sm={12} md={8}>
              <div className="form-group m-0">
                <label className="label">Company</label>
                <Form.Item
                  name="company_id"
                  className="m-0"
                  label="Company"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Select Company"
                    loading={commonLookups.allCompanyLookup.loading}
                    onChange={handleCompanyChange}
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option: any) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA: any, optionB: any) =>
                      optionA.children
                        ?.toLowerCase()
                        ?.localeCompare(optionB.children?.toLowerCase())
                    }
                  >
                    {commonLookups.allCompanyLookup.data.map((option: ILookup) => (
                      <Option key={option.id} value={option.id}>
                        {option.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group m-0">
                <label className="label">BU</label>
                <Form.Item name="bu_id" className="m-0" label="BU" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select BU"
                    loading={commonLookups.buLookup.loading}
                    onChange={handleBUChange}
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option: any) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA: any, optionB: any) =>
                      optionA.children
                        ?.toLowerCase()
                        ?.localeCompare(optionB.children?.toLowerCase())
                    }
                  >
                    {commonLookups.buLookup.data.map((option: ILookup) => (
                      <Option key={option.id} value={option.id}>
                        {option.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group m-0">
                <label className="label">Date Added</label>
                <Form.Item
                  name="date_added"
                  className="m-0"
                  label="Date Added"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Select Date"
                    loading={commonLookups.getScheduledDate.loading}
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option: any) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA: any, optionB: any) =>
                      optionA.children
                        ?.toLowerCase()
                        ?.localeCompare(optionB.children?.toLowerCase())
                    }
                  >
                    {commonLookups.getScheduledDate.data.map((option: any) => (
                      <Option key={option} value={getandReturn(option).format(Common.DATEFORMAT)}>
                        {getandReturn(option)?.toString() == 'Invalid date'
                          ? 'NULL'
                          : getandReturn(option).format(Common.DATEFORMAT)}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            {/* <Col xs={24} sm={12} md={8}>
              <div className="form-group m-0">
                <label className="label">Date Added</label>
                <Form.Item
                  name="date_added"
                  label="Date Added"
                  className="m-0"
                  rules={[{ required: true }]}
                >
                  <DatePicker className="w-100" disabledDate={disabledDate} />
                </Form.Item>
              </div>
            </Col> */}
            <Col xs={24} sm={12} md={8}>
              <div className="form-group m-0">
                <label className="label">SC Version</label>
                <Form.Item name="sc_version_id" className="m-0" label="SC Version">
                  <Select
                    allowClear
                    loading={commonLookups.configWindowsServerVersionsLookup.loading}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option: any) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA: any, optionB: any) =>
                      optionA.children
                        ?.toLowerCase()
                        ?.localeCompare(optionB.children?.toLowerCase())
                    }
                  >
                    {commonLookups.configWindowsServerVersionsLookup.data.map((option: ILookup) => (
                      <Option key={option.id} value={option.id}>
                        {option.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            {/* <Col xs={24} sm={12} md={8}>
              <div className="form-group m-0">
                <label className="label">SC Version</label>
                <Form.Item
                  name="sc_version_id"
                  label="SC Version"
                  className="m-0"
                  rules={[{ type: 'integer' }]}
                >
                  <InputNumber className="form-control w-100" />
                </Form.Item>
              </div>
            </Col> */}
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="set_device_states" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Set Device States</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item
                  name="set_device_states_inc_non_prod"
                  className="m-0"
                  valuePropName="checked"
                >
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Set Device States Inc Non Prod</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item
                  name="set_device_states_by_keyword"
                  className="m-0"
                  valuePropName="checked"
                >
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Set Device States By KeyWord</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="x_ref_ad" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">XRefAD</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="x_ref_azure" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">XRefAzure</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="sc_version_apply_all" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">SC Version Apply All</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="update_rv_tools_vm" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Update RVTools_VM</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="update_rv_tools_host" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Update RVTools_Host</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="apply_overrides" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Apply Overrides</label>
              </div>
            </Col>
          </Row>
          <div className="btns-block modal-footer pt-lg">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={windowsServerInventory.processData.loading}
            >
              Process
            </Button>
            <Can I={Action.ModelDataSeletion} a={Page.ConfigModelPopUpSelection}>
              <Button
                type="dashed"
                ghost
                disabled={form.getFieldValue('company_id') === null}
                onClick={saveConfig}
                loading={commonLookups.setModelPopUpSelection.loading}
              >
                Save Configuration
              </Button>
            </Can>
            <Button key="back" onClick={handleModalClose}>
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};
export default ProcessDataModal;
