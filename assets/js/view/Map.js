/** @file Map.js
 *  @fileOverview Map view for tweet-map
 *  @author cs_brandt
 *  @date 10/12/2012 
 */


define(['jquery', 'underscore', 'backbone', 'text!../../template/twitter/tweet.html', 'googlemaps', 'order!timeago'], function($, _, Backbone, TweetTemplate)
{
   var Map = Backbone.View.extend(
   {
      initialize: function()
      {
         // Mustache style syntax
         _.templateSettings.interpolate = /\{\{(.+?)\}\}/g;
         // compile TweetTemplate
         var tweetTemplate = _.template(TweetTemplate);
         // map of google.maps.InfoWindow objects
         var infoWindows = {};
         // the zindex for info windows
         // to be incremented after each
         // subsequent window
         var infoWindowZ = 0;

         // http://en.wikipedia.org/wiki/Geographic_center_of_the_contiguous_United_States
         var mapCenter = new google.maps.LatLng(39.50, -98.35);

         var mapOptions = {
            center: mapCenter,
            zoom: 5,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            zoomControl: true,
            zoomControlOptions: {
               position: google.maps.ControlPosition.RIGHT_CENTER,
               style: google.maps.ZoomControlStyle.SMALL
            },
            panControl: false,
            streetViewControl: false,
            mapTypeControl: false
         };

         var map = new google.maps.Map($(this.el)[0], mapOptions);

         // bind changes on the zip model
         this.options.zip.bind('change:geocodedZIP', function(zip)
         {
            // viewport stores the recommended viewport for the returned result.
            // (LatLngBounds)
            var viewportLatLngBounds = zip.get("geocodedZIP").geometry.viewport;

            map.fitBounds(viewportLatLngBounds);

            this.collection.latitude = viewportLatLngBounds.getCenter().lat();
            this.collection.longitude = viewportLatLngBounds.getCenter().lng();

            // calculate radius
            // get distance..
            // from (lat of NE corner), (lng of center)
            // to   (lat of center), (lng of center)
            var topCenterLatLng = new google.maps.LatLng(viewportLatLngBounds.getNorthEast().lat(), viewportLatLngBounds.getCenter().lng());

            var metersRadius = google.maps.geometry.spherical.computeDistanceBetween(viewportLatLngBounds.getCenter(), topCenterLatLng);

            this.collection.radius = metersRadius / 1000;
            this.collection.radiusUnits = "km";

            // the url for the collection is ready
            // run fetch on the collection
            this.collection.fetch();

            // from https://dev.twitter.com/docs/api/1.1/get/search/tweets
            // GET search/tweets limit 180 per 15 minutes
            // Request frequency 1 per 5 seconds
            setInterval(function()
            {
               this.collection.fetch();

            }.bind(this), 5000);

         }.bind(this));

         // bind the collection's add event
         this.collection.bind("add", function(model)
         {
            var modelJSON = model.toJSON();
            var links = modelJSON.text.split("http://");
            var parsedText = "";

            if (links.length > 1)
            {
               for (var c = 1; c < links.length; c++)
               {
                  var urlText = "http://" + links[c];
                  var anchorText = "<a href=\"" + urlText + "\">" + urlText + "</a>";

                  parsedText += links[c - 1] + anchorText;
               }

               modelJSON.parsedText = parsedText;
            }
            else
            {
               modelJSON.parsedText = modelJSON.text;
            }

            // only create an infoWindow if
            // the model has a geo component
            // and if the infoWindow has
            // yet to be created
            if (modelJSON.geo && !infoWindows[modelJSON.id])
            {
               var tweetWindowOptions = {
                  position: new google.maps.LatLng(modelJSON.geo.coordinates[0], modelJSON.geo.coordinates[1]),
                  content: tweetTemplate(modelJSON),
                  disableAutoPan: true,
                  maxWidth: 190,
                  zIndex: infoWindowZ++
               };

               var infoWindow = new google.maps.InfoWindow(tweetWindowOptions);
               infoWindow.open(map);

               infoWindows[modelJSON.id] = infoWindow;

               // wait for the domready event on the info window
               // then add timeago, http://timeago.yarp.com/
               google.maps.event.addListener(infoWindow, 'domready', function() 
               {
                  $("abbr.tweet_timeago").timeago();
               });
            }

         }.bind(this));
      }
   });

   return Map;

});