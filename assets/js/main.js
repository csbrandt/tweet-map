/** @file main.js
 *  @fileOverview Program driver. Configures path aliases and calls app.initialize()
 *  @author cs_brandt
 *  @date 10/12/2012 
 */


require.config(
{
   paths: 
   {
      async: '../vendor/libs/requirejs-plugins/async',
      order: '../vendor/libs/requirejs-plugins/order',
      text: '../vendor/libs/requirejs-plugins/text',
      jquery: '../vendor/libs/jquery/jquery-min',
      jqueryui: '../vendor/libs/jquery-ui/jquery-ui',
      underscore: '../vendor/libs/underscore/underscore',
      backbone: '../vendor/libs/backbone/backbone',
      googlemaps: '../vendor/libs/google-maps/google-maps',
      timeago: '../vendor/libs/jquery-timeago/jquery.timeago',
      d3:      '../vendor/libs/d3/d3.v2.min',
      instrumentor: '../vendor/js/instrumentor'
   },
   shim: 
   {
      backbone:
      {
         deps: ['underscore', 'jquery'],
         exports: 'Backbone'
      },
      underscore:
      {
         exports: "_"
      },
      d3: 
      {
         exports: 'd3'
      }
   }

});

require(["app", "instrumentor"], function(App, Instrumentor)
{
   App.initialize();

   //new Instrumentor(App);

});