import { ISearch } from '../../../common/models/common';

export interface IWindowsServerLicenseDetail {
  windows_server_license_detail_id?: number;
  windows_server_license_id?: number;
  company_id?: number;
  bu_id?: number;
  date_added?: Date;
  opt_agreement_type?: number;
  opt_exclude_non_prod?: boolean;
  opt_default_to_data_center_on_hosts?: boolean;
  opt_entitlements?: boolean;
  name?: string;
  tenant_id?: number;
  windows_server_id?: number;
  cluster?: string;
  host?: number;
  procs?: number;
  cores?: string;
  device_name?: string;
  device_type?: string;
  product_family?: string;
  version?: string;
  sc_version?: string;
  vcpu?: number;
  ha_enabled?: boolean;
  device_state?: string;
  software_state?: string;
  source?: string;
  drs_enabled?: boolean;
  fqdn?: string;
  cost_code?: string;
  line_of_business?: string;
  market?: string;
  application?: string;
  data_center?: string;
  serial_number?: string;
  edition?: string;
  operating_system?: string;
  exempt?: boolean;
  sc_exempt?: boolean;
  azure_hosted?: boolean;
  orphaned_vm?: boolean;
  licensable?: boolean;
  sc_licensable?: boolean;
  notes?: string;
  sc_notes?: string;
  os_version_id?: number;
  os_edition_id?: number;
  sc_version_id?: number;
  max_os_version_id?: number;
  max_os_edition_id?: number;
  max_sc_version_id?: number;
  cluster_seq_num?: number;
  host_seq_num?: number;
  device_seq_num?: number;
  host_num_of_vms?: number;
  host_num_of_vms_licensable?: number;
  host_num_vms_with_ws_dc?: number;
  host_sc_num_of_vms_licensable?: number;
  cluster_num_of_vms?: number;
  cluster_num_of_vms_licensable?: number;
  cluster_num_vms_with_ws_dc?: number;
  cluster_sc_num_of_vms_licensable?: number;
  ws_effective_processors?: number;
  ws_effective_cores?: number;
  ws_license_multiplier?: number;
  ws_license_type?: string;
  ws_license_count?: number;
  ws_license_cost?: number;
  sc_license_multiplier?: number;
  sc_license_type?: string;
  sc_license_count?: number;
  sc_license_cost?: number;
  s_ws_dc_core_licenses?: number;
  s_ws_std_core_licenses?: number;
  s_ws_dc_core_licenses_cost?: number;
  s_ws_std_core_licenses_cost?: number;
  s_sc_dc_core_licenses?: number;
  s_sc_std_core_licenses?: number;
  s_sc_dc_core_licenses_cost?: number;
  s_sc_std_core_licenses_cost?: number;
  license_id?: number;
  license_qty?: number;
  sc_license_id?: number;
  sc_license_qty?: number;
  assigned_license_id?: number;
  assigned_license_qty?: number;
  assigned_sc_license_id?: number;
  assigned_sc_license_qty?: number;
  sc_server?: boolean;
  sc_agent?: boolean;
}

export interface ISearchWindowsServerLicenseDetail extends ISearch {
  windows_server_license_id: number;
}