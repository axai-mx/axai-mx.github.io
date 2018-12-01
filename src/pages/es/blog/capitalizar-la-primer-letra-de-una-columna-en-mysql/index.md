---
title: "Capitalizar la primer letra de una columna en MySQL"
type: "blog"
date: "2011-01-18T00:35:00.000Z"
user: "joaquin"
language: "es"
tags: ["Planeta Drupal"]
aliases: ["blog/capitalizar-la-primer-letra-de-una-columna-en-mysql"]
---

Mi compañero Elías está metiendo datos de un catálogo de un cliente a su página web que le estamos haciendo. El nombre de todos los productos vienen en mayúsculas, pero por el diseño de la página web no queremos que se vea así, sino que solamente la primer letra esté capitalizada. Para facilitar la entrada de datos lo que hacemos es meter todos los datos como vienen y después usar SQL para cambiar la columna.

La sentencia que utilizamos al final es:

    update node set title = CONCAT(UPPER(LEFT(title, 1)), LOWER(MID(title,2)));
    

### UPDATE!

Bueno para los que usan Drupal se tienen que fijar que el título del nodo se guarda también en la tabla node\_revisions, y además como usamos otro campo de CCK para el título en inglés pues eran 3 columnas:

    update content_field_nombre set field_nombre_value = CONCAT(UPPER(LEFT(field_nombre_value, 1)), LOWER(MID(field_nombre_value,2)));
    update node set title = CONCAT(UPPER(LEFT(title, 1)), LOWER(MID(title,2)));
    update node_revisions set title = CONCAT(UPPER(LEFT(title, 1)), LOWER(MID(title,2)));
    

y no se olviden de limpiar los cachés porque si no, seguirían viendo contenido viejito que ya cambió en la BD.