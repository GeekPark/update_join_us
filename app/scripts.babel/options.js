(function () {
  const TOOL = window.__pluginTool;

  function save_options(e) {
    chrome.storage.sync.set({
      token: document.querySelector('#token').value
    }, () => {
      e.target.innerText = '验证中...';
      TOOL.testToken()
        .then(() => {
          e.target.innerText = '验证通过';
        })
        .catch(() => {
          e.target.innerText = '验证失败，请重试';
        });
    });
  }

  function restore_options() {
    chrome.storage.sync.get({
      token: null,
    }, function(items) {
      document.querySelector('#token').value = items.token;
    });
  }

  document.addEventListener('DOMContentLoaded', restore_options);
  document.querySelector('#save').addEventListener('click', save_options);
})();
