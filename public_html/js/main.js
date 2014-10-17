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
      case 'CreateLink':
        var linkUrl = prompt('Enter the URL fot this link: ', 'http://');
        if (linkUrl !== '') {
          document.execCommand(role, false, linkUrl);
        } else {
          document.execCommand('UnLink', false, null);
        }
        break;
    default:
      document.execCommand(role, false, null);
      break;
  }
  update_output();
  $('article[contenteditable="true"]').focus();
  return false;
});

$('#article-tools a').click(function(e) {
  var role = $(this).data('role');
  $('article[contenteditable="true"]').focus();
  switch(role) {
    case 'insertimage':
      var imgSrc = prompt('Enter image location: ', '');
      if (imageExists(imgSrc)) {
        document.execCommand(role, false, imgSrc);
      }
      break;
    case 'about':
      alert();
      break;
    default:
      break;
  }
  update_output();
  $('article[contenteditable="true"]').focus();
  return false;
});


$('#toolbar a').mouseup(function(e) {
  return false;
});

$('article[contenteditable="true"]').bind('blur keyup paste copy cut mouseup', function(e) {
  update_output();
});

$('div[contenteditable="true"]').bind('blur keyup paste copy cut mouseup', function(e) {
  update_title();
});

$('article[contenteditable="true"]').keydown(function(e) {
  // TODO: If is the first time and key Enters never down needs to add a tag <p>
  if (e.which == 13) {
    document.execCommand('formatBlock', false, 'p');
  } else {
    switchToolbar();
  }
});

$('article[contenteditable="true"]').focus(function() {
  setTimeout( function() {
    $("#article-tools a.tool-img").removeClass('disabled');
  }, 100);
});
$('article[contenteditable="true"]').focusout(function() {
  setTimeout( function() {
    var hasFocus = $("#article-tools a.tool-img").is(":focus");
    hasFocus = hasFocus || $("#article-tools a.tool-img i").is(":focus");
    console.log(hasFocus);
    if(!hasFocus) {
      $("#article-tools a.tool-img").addClass('disabled');
    }
  }, 100);
});

$('div[contenteditable="true"]').keydown(function(e) {
  if (e.which == 13) {
    return false;
  }
});

/**
 * http://www.albertmartin.de/blog/code.php/20/plain-text-paste-with-javascript
 */
$('[contenteditable="true"]').bind('paste',function(e) {
  var id = $(this).attr('id');
  cleanAndPaste(id);
});

function update_output() {
  $('#output').val($('article[contenteditable="true"]').html());
}

function update_title() {
  $('#title').val($('h1[contenteditable="true"]').html());
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
  switchToolbar();
});

function switchToolbar() {
  setTimeout( function() {
    var sel = getSelection();
    if(!sel.isCollapsed){
      $('#toolbar').removeClass('hidden');
    } else {
      $('#toolbar').addClass('hidden');
    }
  }, 1);
}
function cleanAndPaste(id) {
  var editor = document.getElementById(id);
  // get content before paste
  var before = editor.innerHTML;
  setTimeout(function(){
    // get content after paste by a 100ms delay
    var after = editor.innerHTML;
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
    editor.innerHTML = replaced;
  }, 100);
}

function imageExists(url){
  var img = new Image();
  img.onload = function() {
    // code to set the src on success
  };
  img.onerror = function() {
    alert("Path not accessible!");
    return false;
  };
  img.src = url;
  console.log("height img: " + img.height);

  return true;
}
