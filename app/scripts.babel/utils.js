window.__pluginTool = (() => {
  const API = 'https://api.github.com';
  const GISTID = 'f1fac66eee98d3a31c49';

  const getToken = () => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get({
        token: null,
      }, d => resolve(d.token));
    });
  };

  const testToken = () => {
    return new Promise((resolve, reject) => {
      getToken().then((token) => {
        fetch(
          `${API}/gists/${GISTID}/star`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Basic ${window.btoa(token)}`
            }
          }).then(res => {
            if (res.status === 204) resolve();
            else reject();
          });
      });
    });
  };

  return {
    getToken,
    testToken,
  };
})();
