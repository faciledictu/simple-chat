const apiPath = '/api/v1';

const routes = {
  login: () => `${apiPath}/login`,
  data: () => `${apiPath}/data`,
  signup: () => `${apiPath}/signup`,
};

export default routes;
