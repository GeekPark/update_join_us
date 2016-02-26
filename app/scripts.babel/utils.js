window.__pluginTool = (() => {
  const API = 'https://api.github.com';
  const GISTID = 'f1fac66eee98d3a31c49';
  let gistData = null;

  const errorHandle = err => console.error(err);

  const getToken = () => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get({
        token: null,
      }, d => resolve(d.token));
    });
  };

  const authHeader = token => {
    return {
      headers: {
        Authorization: `Basic ${window.btoa(token)}`
      }
    };
  };

  const testToken = () => {
    return new Promise((resolve, reject) => {
      getToken()
        .then(token => {
          return fetch(
            `${API}/gists/${GISTID}/star`,
            Object.assign({}, { method: 'PUT' }, authHeader(token))
          );
        })
        .then(res => {
          if (res.status === 204) resolve();
          else reject();
        });
    });
  };

  const getRemoteData = () => {
    return new Promise((resolve, reject) => {
      getToken()
        .then(token => fetch(`${API}/gists/${GISTID}`))
        .then(res => {
          if (res.status === 200) {
            return res.json();
          } else {
            reject(res);
          }
        })
        .then(data => {
          gistData = {};
          for (let i in data.files) {
            gistData[i] = JSON.parse(data.files[i].content);
          }
          resolve(gistData);
        })
        .catch(errorHandle);
    });
  };

  const getKey = (obj, type) => typeof type !== 'undefined' ? obj[type] : obj;

  const getData = type => {
    return new Promise((resolve, reject) => {
      if (gistData) {
        resolve(getKey(gistData, type));
      } else {
        getRemoteData()
          .then( d => resolve(getKey(gistData, type)));
      }
    });
  };

  const saveData = files => {
    const body = JSON.stringify({ files });

    return getToken()
            .then( token => {
              return fetch(
                `${API}/gists/${GISTID}`,
                Object.assign({}, { method: 'PATCH' }, { body }, authHeader(token))
              );
            });
  };

  return {
    getToken,
    testToken,
    getData,
    saveData,
    k: {
      position: 'position.json',
      page: 'page.json',
      jobs: 'jobs.json'
    }
  };
})();
