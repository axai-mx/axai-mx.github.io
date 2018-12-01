---
title: "Configuración express para Drupal nginx"
type: "blog"
date: "2015-11-13T18:27:00.000Z"
user: "elias"
language: "es"
tags: ["Planeta Drupal"]
aliases: ["blog/configuración-express-para-drupal-nginx","blog/configuración-express-para-nginx"]
---

Si ya tienes un ambiente funcional de desarrollo y ya descargaste los archivos de Drupal de tu sitio, así como instalada la base de datos, los únicos cambios que se requieren para tener un sitio corriendo localmente (es decir, sin usar el comando drush rs) son:

Crear un archivo llamado `/etc/nginx/sites-available/sitionuevo.conf` con el siguiente contenido:

    server {
      listen       80;
      server_name  sitionuevo
      root         /home/usuario/work/drupal-sites/sitionuevo/drupal;
      include      /home/usuario/work/simple-drupal-nginx/drupal.conf;
    }
    

Editar el archivo **/etc/hosts** y agregar esta línea:

    127.0.0.1 sitionuevo
    

El archivo de configuración de nginx que creamos está en la carpeta `sites-available`. Para habilitarlo hay que hacer dos cosas: 1) crear un symlink a la carpeta `sites-enabled` 2) reiniciar nginx:

    sudo ln -s /etc/nginx/sites-available/sitionuevo.conf /etc/nginx/sites-enabled/sitionuevo.conf
    sudo service nginx reload
    

**No olvidar que el _sitionuevo_ debe ser cambiado en todos los archivos donde se instancia.**

Listo, ya puedes acceder al URL **sitionuevo** en tu explorador web.

El contenido de drupal.conf puede ser encontrado aquí: [https://github.com/jackbravo/simple-drupal-nginx/blob/master/drupal.conf](https://github.com/jackbravo/simple-drupal-nginx/blob/master/drupal.conf) **sin embargo** el archivo hace referencia a una versión específica de php-fpm (como se puede ver en la línea 91), si estás usando otra versión de PHP tendrás que actualizar esa línea para hacer referencia al archivo/versión correcto según lo que tengas instalado.