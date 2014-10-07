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

$('#editor').bind('blur keyup paste copy cut mouseup', function(e) {
  update_output();
});

$('article[contenteditable="true"]').keydown(function(e) {
  // TODO: If is the first time and key Enters never down needs to add a tag <p>
  if (e.which == 13) {
    document.execCommand('formatBlock', false, 'p');
  }
});

/**
 * http://www.albertmartin.de/blog/code.php/20/plain-text-paste-with-javascript
 */
$('article[contenteditable="true"]').on('paste',function(e) {
  var cp = e.originalEvent.clipboardData;
  var text = cp.getData(cp.types[cp.types.length-1]);
  insertTextAtCursor(text);
  return false;
});

function update_output() {
  $('#output').val($('#editor').html());
}

function p(t){
    t = t.trim();
    return (t.length > 0 ? '<p>' + t.replace(/[\r\n]+/,'</p><p>') + '</p>' : null);
}

function insertTextAtCursor(text) {
    var sel, range;
    sel = window.getSelection();
    range = sel.getRangeAt(0);
    range.deleteContents();
    var textNode = document.createTextNode(text);

    range.insertNode(textNode);
    range.setStartAfter(textNode);
    sel.removeAllRanges();
    sel.addRange(range);
}

$('article[contenteditable="true"]').on('drop',function(e) {
  e.preventDefault();
  var dt = e.originalEvent.dataTransfer;
  var text = dt.getData('text/plain');
  var html = dt.getData('text/html');

  $(this).get(0).innerHTML = text;
});

$('article[contenteditable="true"]').mouseup(function() {
  setTimeout( function() {
    var controls = $('#toolbar');
    if(!sel.isCollapsed){
      controls.removeClass('hidden');
    } else {
      controls.addClass('hidden');
    }
  }, 1);
  var sel = getSelection();
});
