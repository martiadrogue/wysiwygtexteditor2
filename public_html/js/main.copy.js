/*
Big Thanks To:
https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla#Executing_Commands
*/

$('#editControls a').click(function(e) {
  var role = $(this).data('role');

  switch(role) {
    case 'p':
      document.execCommand('formatBlock', false, role);
      break;
    default:
      document.execCommand(role, false, null);
      break;
    }
  update_output();
})

$('#editor').bind('blur keyup paste copy cut mouseup', function(e) {
  update_output();
})

function update_output() {
  $('#output').val($('#editor').html());
}

$('div[contenteditable="true"]').keydown(function(e) {
  // TODO: If is the first time and key Enters never down needs to add a tag <p>
  if (e.which == 13) {
    document.execCommand('formatBlock', false, 'p');
    //make the br replace selection
    var range = window.getSelection().getRangeAt(0);
    range.deleteContents();
    range.insertNode(docFragment);
    //create a new range
    range = document.createRange();
    range.setStartAfter(newEle);
    range.collapse(true);
    //make the cursor there
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    return false;
  } else {
    return true;
  }
});

$('div[contenteditable="true"]').on('paste',function(e) {
  var cp = e.originalEvent.clipboardData;
  console.log(cp.getData(cp.types[cp.types.length-1]));
  var text = p(cp.getData(cp.types[cp.types.length-1]));
  text = strip_tags(text, [ 'p','b', 'i', 'u', 'strike', 'blockquote', 'ul', 'ol', 'li', 'sub', 'sup', 'i', 'i' ]);
  console.log(text);

  insertTextAtCursor(text);
  return false;
});

function p(t){
    t = t.trim();
    return (t.length > 0 ? '<p>' + t.replace(/[\r\n]+/,'</p><p>') + '</p>' : null);
}

function strip_tags(html, keepTags) {
  var ptn = new RegExp('<(?!\/?(' + keepTags.join('|') + '))[^>]+>', 'g');
  return html.replace(ptn, '');
}

function insertTextAtCursor(text) {
    var sel, range;
    sel = window.getSelection();
    range = sel.getRangeAt(0);
    range.deleteContents();
    var textNode = document.createTextNode(text);
    console.log(textNode);

    range.insertNode(text);
    range.setStartAfter(textNode);
    sel.removeAllRanges();
    sel.addRange(range);
}

$('div[contenteditable="true"]').on('drop',function(e) {
  e.preventDefault();
  var dt = e.originalEvent.dataTransfer;
  console.log(dt.types);

  var text = dt.getData('text/plain');
  var html = dt.getData('text/html')

  $(this).get(0).innerHTML = text;

  console.log(text);
  console.log(html);
});

$('div[contenteditable="true"]').click(function(e) {
  if (!$(this).html()) {
    document.execCommand('formatBlock', false, 'p');
  }
});
