import { Button, Col, Form, Modal, Row, Select } from 'antd';
import { useEffect } from 'react';
import { ILookup } from '../../../../services/common/common.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getAllCompanyLookup,
  getBULookup,
  getScheduleDate,
} from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearDateLookup,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { IReRunAllScenariosModalProps } from './reRunAllScenarios.model';
import { reRunAllScenarios } from '../../../../store/sqlServer/sqlServerLicense/sqlServerLicense.action';
import { toast } from 'react-toastify';
import {
  clearSqlServerLicenseReRunAllScenariosMessages,
  sqlServerLicenseSelector,
} from '../../../../store/sqlServer/sqlServerLicense/sqlServerLicense.reducer';
import _ from 'lodash';
import { validateMessages } from '../../../../common/constants/common';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { IInlineSearch } from '../../../../common/models/common';
import {
  forDropDown,
  getScheduleDateHelperLookup,
  showDateFromApi,
  getandReturn,
} from '../../../../common/helperFunction';

const { Option } = Select;

const ReRunAllScenariosModal: React.FC<IReRunAllScenariosModalProps> = (props) => {
  const sqlServersLicense = useAppSelector(sqlServerLicenseSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { showModal, handleModalClose, filterKeys } = props;

  const [form] = Form.useForm();

  const initialValues = {
    company_id: globalFilters.search.company_id !== 0 ? globalFilters.search.company_id : null,
    bu_id: globalFilters.search.bu_id !== 0 ? globalFilters.search.bu_id : null,
    selected_date: null,
  };

  const onFinish = (values: any) => {
    dispatch(reRunAllScenarios(values));
  };

  useEffect(() => {
    if (sqlServersLicense.reRunAllScenarios.messages.length > 0) {
      if (sqlServersLicense.reRunAllScenarios.hasErrors) {
        toast.error(sqlServersLicense.reRunAllScenarios.messages.join(' '));
      } else {
        toast.warning(sqlServersLicense.reRunAllScenarios.messages.join(' '));
        handleModalClose();
      }
      dispatch(clearSqlServerLicenseReRunAllScenariosMessages());
    }
  }, [sqlServersLicense.reRunAllScenarios.messages]);

  const handleCompanyChange = (companyId: number) => {
    form.setFieldsValue({ company_id: companyId, bu_id: null, selected_date: null });
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
          getScheduleDateHelperLookup(form.getFieldsValue(), sqlServersLicense.search.tableName)
        )
      );
    } else {
      dispatch(clearDateLookup());
    }
    form.setFieldsValue({ bu_id: buId });
  };

  useEffect(() => {
    dispatch(getAllCompanyLookup());
    if (globalFilters.search.company_id !== 0 && globalFilters.search.company_id)
      dispatch(getBULookup(globalFilters.search.company_id));
    return () => {
      dispatch(clearDateLookup());
      dispatch(clearBULookUp());
    };
  }, [dispatch]);

  useEffect(() => {
    const globalSearch: IInlineSearch = {};
    for (const key in globalFilters.search) {
      const element = globalFilters.search[key];
      globalSearch[key] = element ? [element] : null;
    }
    if (globalSearch.company_id !== undefined && globalSearch.company_id !== null)
      dispatch(getBULookup(globalSearch.company_id[0]));
    const filterValues = {
      company_id:
        _.isNull(globalSearch.company_id) || globalSearch.company_id == undefined
          ? null
          : globalSearch.company_id[0],
      bu_id:
        _.isNull(globalSearch.bu_id) || globalSearch.bu_id == undefined
          ? null
          : globalSearch.bu_id[0],
      selected_date:
        filterKeys?.filter_keys?.date_added?.length === 1
          ? getandReturn(filterKeys.filter_keys.date_added[0]).format('YYYY-MM-DD')
          : null,
    };
    if (globalFilters.search.company_id || filterKeys?.filter_keys?.date_added?.length === 1) {
      dispatch(
        getScheduleDate(
          getScheduleDateHelperLookup(filterValues, sqlServersLicense.search.tableName)
        )
      );
    }
    form.setFieldsValue(filterValues);
  }, []);

  return (
    <>
      <Modal
        wrapClassName="custom-modal"
        title="Re-Run Scenarios"
        centered
        visible={showModal}
        onCancel={handleModalClose}
        footer={false}
      >
        <Form
          form={form}
          name="reRunAllScenarios"
          initialValues={initialValues}
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Row gutter={[30, 15]} className="form-label-hide">
            <Col xs={24} sm={12} md={8}>
              <div className="form-group m-0">
                <label className="label">Company Name</label>
                <Form.Item
                  name="company_id"
                  className="m-0"
                  label="Company"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Select Company Name"
                    loading={commonLookups.allCompanyLookup.loading}
                    onChange={handleCompanyChange}
                    allowClear
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
                <label className="label">BU Name</label>
                <Form.Item name="bu_id" className="m-0" label="BU" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select BU Name"
                    loading={commonLookups.buLookup.loading}
                    onChange={handleBUChange}
                    allowClear
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
                <label className="label">Selected Date</label>
                <Form.Item
                  name="selected_date"
                  label="Selected Date"
                  className="m-0"
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
                      <Option key={option} value={showDateFromApi(option)}>
                        {forDropDown(option) == 'Invalid date' ? 'NULL' : showDateFromApi(option)}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>
          <div className="btns-block modal-footer pt-lg">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={sqlServersLicense.reRunAllScenarios.loading}
            >
              Process
            </Button>
            <Button key="back" onClick={handleModalClose}>
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};
export default ReRunAllScenariosModal;
