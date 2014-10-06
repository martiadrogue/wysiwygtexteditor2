<?php

if (isset($_POST['title'], $_POST['body'])) {
  echo '<h1>You posted:</h1><hr />' . $_POST['title'] . '<hr />' .stripslashes($_POST['body']);
}


$html = file_get_contents('index.html');
echo $html;
