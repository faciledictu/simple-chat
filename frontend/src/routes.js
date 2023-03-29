const apiPath = '/api/v1';

const routes = {
  chatPage: () => '/',
  loginPage: () => '/login',
  signupPage: () => '/signup',
  login: () => `${apiPath}/login`,
  data: () => `${apiPath}/data`,
  signup: () => `${apiPath}/signup`,
};

export default routes;
