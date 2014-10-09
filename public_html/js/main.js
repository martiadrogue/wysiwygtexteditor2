/*
Big Thanks To:
https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla#Executing_Commands
*/

$('#toolbar a').click(function(e) {
  var role = $(this).data('role');

  switch(role) {
    case 'p':
      document.execCommand('formatBlock', false, role);
      break;
    case 'InsertUnorderedList':
      document.execCommand(role, false, 'newUL');
      break;
    case 'InsertOrderedList':
      document.execCommand(role, false, 'newOL');
      break;
    default:
      document.execCommand(role, false, null);
      break;
  }

  update_output();
});

$('#toolbar a').mouseup(function(e) {
  return false;
});

$('#editor').bind('blur keyup paste copy cut mouseup', function(e) {
  update_output();
});

$('h1[contenteditable="true"]').bind('blur keyup paste copy cut mouseup', function(e) {
  update_title();
});

$('article[contenteditable="true"]').keydown(function(e) {
  // TODO: If is the first time and key Enters never down needs to add a tag <p>
  if (e.which == 13) {
    document.execCommand('formatBlock', false, 'p');
  }
});

$('h1[contenteditable="true"]').keydown(function(e) {
  // TODO: If is the first time and key Enters never down needs to add a tag <p>
  if (e.which == 13) {
    return false;
  }
});

/**
 * http://www.albertmartin.de/blog/code.php/20/plain-text-paste-with-javascript
 */
$('[contenteditable="true"]').bind('paste',function(e) {
  // get content before paste
  var before = document.getElementById('editor').innerHTML;
  setTimeout(function(){
    // get content after paste by a 100ms delay
    var after = document.getElementById('editor').innerHTML;
    // find the start and end position where the two differ
    var pos1 = -1;
    var pos2 = -1;
    for (var i=0; i<after.length; i++) {
      if (pos1 == -1 && before.substr(i, 1) != after.substr(i, 1)) pos1 = i;
      if (pos2 == -1 && before.substr(before.length-i-1, 1) != after.substr(after.length-i-1, 1)) pos2 = i;
    }
    // the difference = pasted string with HTML:
    var pasted = after.substr(pos1, after.length-pos2-pos1);
    // strip the tags:
    var replace = pasted.replace(/<[^>]+>/g, '');
    // build clean content:
    var replaced = after.substr(0, pos1)+replace+after.substr(pos1+pasted.length);
    // replace the HTML mess with the plain content
    document.getElementById('editor').innerHTML = replaced;
  }, 100);
});

function update_output() {
  $('#output').val($('#editor').html());
}

function update_title() {
  $('input[type="text"]').val($('h1[contenteditable="true"]').html());
}

$('[contenteditable="true"]').on('drop',function(e) {
  e.preventDefault();
  var dt = e.originalEvent.dataTransfer;
  var text = dt.getData('text/plain');
  var html = dt.getData('text/html');

  $(this).get(0).innerHTML = text;
});

$(this).mouseup(function(e) {
  var nodeName = e.target.nodeName;
  if(nodeName != 'ARTICLE') {
    $('#toolbar').addClass('hidden');
  }
});

$('article[contenteditable="true"]').mouseup(function() {
  setTimeout( function() {
    var sel = getSelection();
    if(!sel.isCollapsed){
      $('#toolbar').removeClass('hidden');
    } else {
      $('#toolbar').addClass('hidden');
    }
  }, 1);
});
