import { IApiResponse, ISearchResponse } from '../../../common/models/common';
import request from '../../../utils/request';
import {
  ISearchO365ActivationsUserDetail,
  IO365ActivationsUserDetail,
} from './o365ActivationsUserDetail.model';

class O365ActivationsUserDetailService {
  ENDPOINT = '/o365-activations-user-detail';

  public async searchO365ActivationsUserDetail(
    searchParams?: ISearchO365ActivationsUserDetail
  ): Promise<IApiResponse<ISearchResponse<IO365ActivationsUserDetail>>> {
    const url = `${this.ENDPOINT}/search`;
    return request({ url, method: 'POST', data: searchParams }).then((res) => {
      return res.data;
    });
  }

  public async getO365ActivationsUserDetailById(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'GET' }).then((res) => {
      return res.data;
    });
  }

  public async saveO365ActivationsUserDetail(data: IO365ActivationsUserDetail): Promise<any> {
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

  public async deleteO365ActivationsUserDetail(id: number): Promise<any> {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: 'DELETE' }).then((res) => {
      return res.data;
    });
  }

  public async exportExcelFile(searchParams?: ISearchO365ActivationsUserDetail): Promise<any> {
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
export default new O365ActivationsUserDetailService();
