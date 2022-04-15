import apiIndex from '../indexAdmin';
import ApiConstants from '../ApiConstants';

export default function loginAdmin(data: any) {
  return apiIndex(ApiConstants.LOGIN_ADMIN, null, 'POST', data);
}
