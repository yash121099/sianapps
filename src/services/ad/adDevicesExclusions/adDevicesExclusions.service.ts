import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import { ISearchAdDevicesExclusions, IAdDevicesExclusions } from './adDevicesExclusions.model';

class AdDevicesExclusionsService {
  ENDPOINT = '/ad-devices-exclusions';

  public async searchAdDevicesExclusions(
    searchParams?: ISearchAdDevicesExclusions
  ): Promise<IApiResponse<ISearchResponse<IAdDevicesExclusions>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getAdDevicesExclusionsById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async getAdDevicesExclusionsFieldLookup(): Promise<any> {
    const url = `${this.ENDPOINT}/field-lookup`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveAdDevicesExclusions(data: IAdDevicesExclusions): Promise<any> {
    const { id, ...restData } = data;
    if (id > 0) {
      const url = `${this.ENDPOINT}/${id}`;
      return request({ url, method: 'PUT', data: restData }).then((res) => {
        return res.data;
      });
    } else {
      const url = `${this.ENDPOINT}`;
      return request({ url, method: 'POST', data: restData }).then((res) => {
        return res.data;
      });
    }
  }

  public async deleteAdDevicesExclusions(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchAdDevicesExclusions): Promise<any> {
    const url = `back-ground-processes/export-excel`;
    return request({
      url,
      method: 'POST',
      data: searchParams,
    }).then((res) => {
      return res;
    });
  }
}
export default new AdDevicesExclusionsService();
