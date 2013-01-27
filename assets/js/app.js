/** @file app.js
 *  @fileOverview App initialization.
 *  @author cs_brandt
 *  @date 10/12/2012 
 */


define(['jquery', 'underscore', 'backbone', 'view/Map', 'model/ZIP', 'collection/Tweets', 'jqueryui'], function($, _, Backbone, Map, ZIP, Tweets)
{
   return {
      initialize: function()
      {
         // jquery UI
         $("button, input[type='button']").button();

         // init
         //
         // model for zip code
         var zip = new ZIP();
         // collection of tweets
         var tweets = new Tweets();
         // view for map
         var map = new Map(
         {
            zip: zip,
            el: $("#map_canvas"),
            collection: tweets
         });

         // update the ZIP code model on click
         $("#zip_form").submit(function()
         {
            zip.set(
            {
               zipText: $("#zip_field").val()
            });
         });
      }
   };
});