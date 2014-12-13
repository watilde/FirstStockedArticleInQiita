window.onload = function () {
  if (1 > window.location.hash.length) return;
  var username = window.location.hash.substr(1);
  $('#username').val(username);
  $('#main').fadeOut('fast',search(username));
};

$('#username').keypress( function (e) {
  var username = $('#username').val();
  window.location.hash = username;
  username = encodeURIComponent(username);
  if (e.which === 13) {
    $('#main').fadeOut('fast',search(username));
  }
});

$('#search').on('click', function (){
  var username = $('#username').val();
  window.location.hash = username;
  username = encodeURIComponent(username);
  $('#main').fadeOut('fast',search(username));
});

function search (username) {
  var page = 1;
  $.ajax({
    url:'http://qiita.com/api/v2/users/' + username + '/stocks',
    data:{
      page: page,
      per_page: 100
    }
  }).done(function (data) {
    data = data.slice(-1)[0];
    $('#avatar_url').attr('src', data.user.profile_image_url);
    $('#name').text(data.title);
    $('#login').text('@' + data.user.id);
    $('#description').text(data.body);
    $('#owner').attr('href', 'http://qiita.com/' + data.user.id);
    $('.owner_url').attr('href', 'http://qiita.com/' + data.user.id);
    $('.html_url').attr('href', data.url);

    $('#share').attr('href', 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(window.location.href) +
      '&amp;text=I+found+' + username + '\'s+%23FirstStockedArticleInQiita%3A+' +
      encodeURIComponent(data.url) + '.+What+was+yours%3F');

    $.ajax({
      url: 'http://qiita.com/api/v2/items/' + data.id + '/stockers'
    }).done(function (data) {
      $('#stockers_count').text(data.length);
      $('#main').fadeIn('slow');
    });
  });
}
