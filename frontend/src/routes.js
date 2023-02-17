const apiPath = '/api/v1';

const routes = {
  login: () => `${apiPath}/login`,
  data: () => `${apiPath}/data`,
  singup: () => `${apiPath}/signup`,
};

export default routes;
