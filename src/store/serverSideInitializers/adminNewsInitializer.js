import { initialState as adminNewsState } from '../../reducers/adminNews';
import fetch from '../../core/fetch';
import { apiUrl } from '../../config';

export default async function getAdminNewsInitialState(authCookie) {
  const getData = async() => {

    const headers = {
      'x-access-token': authCookie,
      'authorization': 'Basic YnVyY3p1OmFiY2RmcmJrMzQwMzQxZmRzZnZkcw=='
    };
    const response = await fetch(`${apiUrl}/admin/news`, { headers });
    return await response.json();
  };

  try {
    const remoteData = await getData();

    if (remoteData.success === false && (remoteData.reason === 'bad-token' || remoteData.reason === 'no-token')) {
      return {
        tokenExpired: true,
        adminNewsState
      };
    }

    adminNewsState.newsList = remoteData.newses;
    adminNewsState.newsListLoading = false;

    return {
      tokenExpired: false,
      adminNewsState
    };
  } catch (error) {
    console.log(error); // eslint-disable-line no-console, no-undef
  }
}
