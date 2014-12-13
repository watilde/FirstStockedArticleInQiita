window.onload = function () {
  if (1 > window.location.hash.length) return;
  var username = window.location.hash.substr(1);
  $('#username').val(username);
  $('#main').fadeOut('fast', search(username));
};

setInterval(function (){
  var username = $('#username').val();
  window.location.hash = username;
}, 16);

$('#username').keypress(function (e) {
  var username = $('#username').val();
  username = encodeURIComponent(username);
  if (e.which === 13) {
    $('#main').fadeOut('fast', search(username));
  }
});

$('#search').on('click', function (){
  var username = $('#username').val();
  window.location.hash = username;
  username = encodeURIComponent(username);
  $('#main').fadeOut('fast', search(username));
});

$('#error_alert_close').on('click', function () {
  $('#error_alert').fadeOut('slow');
});

function search (username, page, _data) {
  page = page || 1;
  $.ajax({
    url:'http://qiita.com/api/v2/users/' + username + '/stocks',
    data:{
      page: page,
      per_page: 100
    }
  }).done(function (data) {
    // Pager
    if (data.length !== 0) {
      search(username, ++page, data);
      return;
    }
    data = _data.slice(-1)[0];
    var date = (function () {
      var d = data.created_at;
      d = new Date(d);
      var y = d.getFullYear();
      var m = d.getMonth();
      var d = d.getDate();
      var mon = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];

      return mon[m] +' ' + d + ', ' + y;
    }());
    $('#created_at').text(date);
    $('#avatar_url').attr('src', data.user.profile_image_url);
    $('#name').text(data.title);
    $('#login').text('@' + data.user.id);
    $('#description').text(data.body);
    $('#owner').attr('href', 'http://qiita.com/' + data.user.id);
    $('.owner_url').attr('href', 'http://qiita.com/' + data.user.id);
    $('.html_url').attr('href', data.url);
    appendHatenaButton(data.title, data.url)

    $('#share').attr('href', 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(window.location.href) +
      '&amp;text=I+found+' + username + '\'s+%23FirstStockedArticleInQiita%3A+"' + data.title + '" ' +
      encodeURIComponent(data.url) + ' +What+was+yours%3F');

    $.ajax({
      url: 'http://qiita.com/api/v2/items/' + data.id + '/stockers'
    }).done(function (data) {
      $('#stockers').empty();
      Object.keys(data).forEach(function (key) {
        var d = data[key];
        var id = d.id;
        var url = 'http://qiita.com/' + id;
        var image = d.profile_image_url;
        var img = $('<img>');
        img.attr({
          src: image,
          width: 18,
          height: 18
        });
        var link = $('<a></a>');
        link.attr('href', url);
        link.append(img);
        $('#stockers').append(link);
      });
      $('#stockers_count').text(data.length);
      $('#main').fadeIn('slow');
    });
  }).fail(function (e) {
    var status = e.status;
    var statusText = e.statusText;
    $('#error_status').text(status);
    $('#error_text').text(statusText);
    $('#error_alert').fadeIn('slow');
  });
}

function appendHatenaButton(title, url) {
  var tag = '<a href="http://b.hatena.ne.jp/entry/' + url + '" class="hatena-bookmark-button" data-hatena-bookmark-title="' + title + '" data-hatena-bookmark-layout="standard" title="このエントリーをはてなブックマークに追加"><img src="http://b.st-hatena.com/images/entry-button/button-only.gif" alt="このエントリーをはてなブックマークに追加" width="20" height="20" style="border: none;" /></a><script type="text/javascript" src="http://b.st-hatena.com/js/bookmark_button.js" charset="utf-8" async="async"></script>';
  $('#hatena-button').empty();
  tag = $(tag);
  $('#hatena-button').append(tag);
}


var input = [];
console.log('Try to type Konami Code <3');
konami = [38,38,40,40,37,39,37,39,66,65];

$(window).keyup(function(e){
  input.push(e.keyCode);

  if (input.toString().indexOf(konami) >= 0) {
    $('#logo').addClass('spin');
    setTimeout(function (){
      $('#logo').removeClass('spin');
    }, 3000);
    input = [];
  }
});
