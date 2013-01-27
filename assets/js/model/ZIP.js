/** @file ZIP.js
 *  @fileOverview Model for ZIP codes and other location types.
 *  Uses Google Maps API V3 to geocode locations.
 *  @author cs_brandt
 *  @date 10/12/2012 
 */


define(['jquery', 'underscore', 'backbone', 'googlemaps'], function($, _, Backbone)
{
   var ZIP = Backbone.Model.extend(
   {
      initialize: function()
      {
         // bind any changes to zipText to geocodeZIP
         this.bind("change:zipText", this.geocodeZIP);
      },

      // geocode zipText and store the results
      // in geocodedZIP
      geocodeZIP: function()
      {
         var geoCoder = new google.maps.Geocoder();

         geoCoder.geocode(
         {
            "address": this.get("zipText")
         }, function(results, status)
         {
            if (status === google.maps.GeocoderStatus.OK)
            {
               this.set(
               {
                  geocodedZIP: results[0]
               });
            }

         }.bind(this));
      }
   });

   return ZIP;

});