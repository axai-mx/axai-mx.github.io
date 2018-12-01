---
title: "Usando views handlers para mostrar el total de una vista de inventario"
type: "blog"
date: "2011-08-04T21:35:00.000Z"
user: "joaquin"
language: "es"
tags: ["Planeta Drupal"]
aliases: ["blog/usando-views-handlers-para-mostrar-el-total-de-una-vista-de-inventario"]
---

Hay veces que quieres desplegar información específica en una vista además de los datos que traes de tus nodos. Bien puede ser para desplegar simplemente una descripción de tu vista, o tal vez un subtítulo con datos de tu argumento, o incluso un subtotal si estás mostrando datos de productos o algo así.

Este tipo de cosas las puedes insertar en el header y footer de tu view. Y en los casos más sencillos puedes simplemente insertar un "text area" donde pongas el texto estático. Pero hay veces que quieres más ;-).

Pudiera ser tentador habilitar el módulo "PHP Filter" y poner código de PHP ahí mismo en tu vista. Para algo sencillo puede ser suficiente, pero si tu código van a ser más de 3 líneas te recomiendo usar un views\_handler que sirve precisamente para eso y así podrás meter tu código en un control de versiones y editarlo con vi o emacs.

Manos a la obra, vamos a implementar un modulo views\_total para desplegar el total de un inventario. El views\_total.info está fácil:

    name = Views Total
    description = Implements an area handler to display the inventory summary
    package = Other
    core = 7.x
    
    files[] = views_total.module
    dependencies[] = "views"
    
    ; Views handlers
    files[] = views_total_handler_area_summary.inc
    

El views\_total.module simplemente implemente el hook\_views\_api para indicarle a views que existimos:

    &lt;?php
    
    /**
     * Implements hook_views_api().
     */
    function views_total_views_api() {
      return array(
        'api' =&gt; 3,
      );
    }
    

En el views\_total.views.inc finalmente declaramos nuestro handler que va a estar en la "tabla global" porque no estámos adjuntándonos a ninguna tabla de nuestra BD.

    &lt;?php
    
    /**
     * Implements hook_views_data.
     */
    function views_total_views_data()
    {
      $data = array();
    
      $data['views_total']['table']['group'] = t('Global');
      $data['views_total']['table']['join'] = array(
        '#global' =&gt; array(),
      );
    
      $data['views_total']['summary'] = array(
        'title' =&gt; t('Inventory summary'),
        'help' =&gt; t('Display the total of items in the inventory'),
        'area' =&gt; array(
          'handler' =&gt; 'views_total_handler_area_summary',
        ),
      );
    
      return $data;
    }
    

Y finalmente, viene el bueno, nuestro handler:

    &lt;?php
    
    /**
     * Definir un area handler para que el total del inventario se pueda agregar a la vista
     */
    class views_total_handler_area_summary extends views_handler_area {
    
      function option_definition() {
        $options = parent::option_definition();
    
        // Quitamos opciones del formulario de edición del handler que no queramos.
        // las opciones vienen heredadas del views_handler_area
        unset($options['empty']);
    
        return $options;
      }
    
      function options_form(&amp;$form, &amp;$form_state) {
        parent::options_form($form, $form_state);
    
        // Quitamos el empty también del display
        unset($form['empty']);
      }
    
      // Esto es lo que se va a desplegar en la vista
      function render($empty = FALSE) {
        if (!$empty) {
          $total = 0;
          foreach ($this-&gt;view-&gt;result as $result) {
            $total += $result-&gt;node_taxonomy_index_nid;
          }
          return "Total de equipos$total";
        }
    
        return '';
      }
    }
    

Puedes inspeccionar el $this->view->result con un print\_r o un krumo (si tienes devel instalado) para ver qué variables te pueden servir.

Para hacer este modulito me basé mucho en el código del submodulo line\_item del módulo [commerce](http://drupal.org/project/commerce) para Drupal 7.