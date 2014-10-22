
# WYSIWYG Text Editor

Un processador de text simple per navegadors web, ideal per a continguts de
blocs i altres llocs web basats en articles. Prima la simplicitat, permet editar
el text i en menor mesura els paràgraf, com el sagnat i les llistes.

A la primera línia no se li aplicarà cap estil fins al primer salt de línia que
niua el text en una etiqueta de tipos 'p'. Des de les hores, cada nou paragraf
estarà representata sempre per una etiqueta 'p'. L'ultim paragraf del text
contindrà l'etiqueta 'br' dins la 'p' tan si té text com si no.

Pel que fa el contingut del porta-papers, s'enganxa com a text/plain, sense
etiquetes ni estils, això significa sense salts de línia. El comportament del
cursor varia entre navegadors, en chrome se situa al final del text enganxat, en
Opera al principi d'aquest i en Firefox al principi del contingut editable.

Article molt interessat sobre els processadors de text web: https://medium.com/medium-eng/why-contenteditable-is-terrible-122d8a40e480

- **TODO**: Tots els paragraf han d'estar dins una etiqueta 'p' tan si és l'únic
  com sino.
- **TODO**: Substituir els dialegs dels navegadors per dialegs modals.
- **TODO**: Controlar el comportament de les seleccions multiples.
