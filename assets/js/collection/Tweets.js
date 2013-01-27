/** @file Tweets.js
 *  @fileOverview Collection of Tweet models.
 *  Uses Twitter API V1 to fetch tweets.
 *  @author cs_brandt
 *  @date 10/12/2012 
 */


define(['jquery', 'underscore', 'backbone', 'model/Tweet'], function($, _, Backbone, Tweet)
{
   var Tweets = Backbone.Collection.extend(
   {
      model: Tweet,

      url: function()
      {
         // from https://dev.twitter.com/docs/api/1/get/search
         // "The parameter value is specified by 'latitude,longitude,radius', 
         // where radius units must be specified as either 'mi' (miles) or 'km' (kilometers)"
         // 
         // this request uses version 1 of the twitter api
         // because, "The entire 1.1 API requires a user context when authenticating at this time with OAuth 1.0A"
         // from https://dev.twitter.com/discussions/10644?page=2
         return "http://search.twitter.com/search.json?callback=?&count=100&geocode=" + this.latitude + ',' + this.longitude + ',' + this.radius + this.radiusUnits;
      },

      parse: function(response)
      {
         this.add(response.results);
      }

   });

   return Tweets;

});