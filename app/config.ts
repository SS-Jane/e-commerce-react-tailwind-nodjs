const config = {
  apiPath: 'http://localhost:3010',
  headers: () => {
    return {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    };
  },
};

export default config;
