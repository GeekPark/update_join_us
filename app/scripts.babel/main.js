$(function () {
  const TOOL = window.__pluginTool;
  const prefix = '#__update_join_'
  const $$ = id => $(`${prefix}${id}`);

  const html = chrome.extension.getURL('lagou.html');

  $.get(html).done(data => {
    $('body').append(data);

    const $updateBtn = $$('update-btn');

    $updateBtn.on('click', parseList);
  });

  // 解析职位列表
  function parseList () {
    const list = $('#searchForm .my_jobs li').map(function() {
      const $z = $(this);
      const $a = $z.find('h3 a');

      return {
        id: $z.data('id'),
        title: $a.text(),
        url: $a.attr('href')
      };
    });

    TOOL.getData(TOOL.k.position).then(data => console.log(data));
  }

});
