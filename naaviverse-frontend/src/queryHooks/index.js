import axios from 'axios';
import { useQuery } from 'react-query';

export const getAppByCode = async (app_code) => {
  const { data } = await axios.get(
    `https://comms.globalxchange.io/gxb/apps/get?app_code=${app_code}`
  );
  return data.apps[0];
};

export const useLoadAppDetails = (app_code) => {
  const { data: appByCode, isLoading: appByCodeLoading } = useQuery(
    ['getAppLoginByCode', app_code],
    () => getAppByCode(app_code),
    { enabled: Boolean(app_code) }
  );
  return { appByCode, appByCodeLoading };
};
