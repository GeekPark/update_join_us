$(function () {
  let $jobList = [];
  let fetched = [];

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
    $jobList = $('#searchForm .my_jobs li').map(function() {
      const $z = $(this);
      const $a = $z.find('h3 a');

      return {
        id: $z.data('id'),
        title: $a.text(),
        url: $a.attr('href')
      };
    });

    TOOL.getData(TOOL.k.position).then(renderResult);
  }

  // 渲染结果列表
  function renderResult (positions) {
    const $resultPanel = $$('result-panel');
    const $tpl = $resultPanel.find('li.hide-template');

    $jobList.each(function (index) {
      const $z = $(this)[0];
      const $t = $tpl.clone();

      $t.removeClass('hide-template');
      $t.find('.title').text(`(${$z.id})${$z.title}`);
      $t.data('id', $z.id);
      $t.data('title', $z.title);

      positions.forEach((v, i) => {
        $t.find('select').append(`<option value="${i}">${v.depart}</option>`);
      });

      $resultPanel.addClass('show').find('ul').append($t);

      // fetch detail one by one
      $.ajax($z.url)
        .done(data => {
          fetched.push(
            Object.assign({}, parse(data), $z)
          );

          // all data has been fetch done.
          if (fetched.length === $jobList.length) {
            $$('fetching').remove();
            $$('save-btn').removeClass('disable').on('click', e => {
              $(this).text('保存中...');
              saveData(positions);
            });
          }
        });
    });

    $tpl.remove();
  }

  function parse(data) {
    const $d = $(data);
    const $request = $d.find('.job_request');
    $request.find('.publish_time').remove();
    return {
      request: $request.html(),
      des: $d.find('.job_bt').html()
    };
  }

  function saveData(positions) {
    // read selected position data and save new positions { title, id }
    positions.forEach(v => v.jobs = []);

    $$('result-panel li').each(function(){
      const $z = $(this);
      const option = $z.find('select').val();

      positions.forEach((v, i) => {
        if (+option === i) {
          v.jobs.push({
            title: $z.data('title'),
            id: $z.data('id')
          });
        }
      });
    });

    // read over, send to gist
    TOOL.saveData({
      [TOOL.k.position]: {
        content: JSON.stringify(positions)
      },
      [TOOL.k.jobs]: {
        content: JSON.stringify(fetched)
      }
    }).then(res => {
      if (res.status === 200) {
        alert('更新成功');
      } else {
        alert('未知原因更新失败，请检查 token');
      }
    });
  }

});
