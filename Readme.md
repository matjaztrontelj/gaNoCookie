Use client-side Google Analytics without cookies
============================

Some EU countries implemented privacy laws that require user's opt-in before setting any cookies. Collecting usage statistics only from those users who opt-in into cookies is seriously flawed. This library provides an effective workaround, using Google Analytics Measurment Protocol to feed data to Google Analytics wihout using cookies.

Legal notice
---------------
This solution implements client-side Google Analytics without storing data on user's device (cookies, cache, local storage, Etags...). The solution still uses the data from client devices to facilitate user tracking. Please check cookie laws of your individual country to see if you can legally use this approach without user opt-in. 

License
---------------

The code is licensed under Creative Commons Non-commercial license. You can use the code for free on your personal and non-profit projects. Commercial use requires a small licensing fee. Visit http://www.humane-tehnologije.si/client-side-google-analytics-without-using-cookies for more.

Usage
--------------

__This code works only with Universal Analytics GA profiles.__ If you use a classic Analytics profile, you'll have to create a new one.

The following code examples assume that files are stored in /ganc folder in the root of your web server.

Client usage is compatible with Google Analytics analytics.js usage. Sending page views and events is supported at the moment.

All that is needed to use this library is including the following code in your HTML:

```<body>
...

<!-- Include the ganc code just before the closing body tag. Remove comments and optional stuff in production code. -->
<script>
  //path to the script that will generate and return the user id
  gancGetUidUrl = '/ganc/ga_no_cookie_uid.php';
  
  //just copy and paste this. You only need to edit the url in the last line of this code paragraph
  (function(i,s,o,g,r,a,m){i['GoogleNoCookieAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','/ganc/ga_no_cookie.php?v=3','ganc');
  //Only edit the url in the above line. Instead of including JS file via PHP script, you could also include ga_no_cookie_min.js directly and set up caching with webserver instructions. Use ?v=1234... to force cache update if you change the JS file or upgrade to a new version of this library.

  //Setup tracker id and start sending hits. Enter your tracking id.
  ganc('create', 'UA-123456-1', '');
  //Send page view
  ganc('send', 'pageview');
  
  //Optionally, send events. Category and Action are required.
  ganc('send', 'event', 'EVENT_CATEGORY', 'EVENT_ACTION', 'EVENT_LABEL');
  
  //Optional support for opt-out of data collection
  //id of dom element that will hold opt-in and opt-out links (optional)
  ganc_status_eid = "ganc_status";
  //text for the link if ganc is on
  ganc_status_on = "Turn off anonymous usage statistics collection.";
  //text for the link if ganc is off
  ganc_status_off = "Turn on anonymous usage statistics collection";

  //That's it! Check GA Real time view to see if it is working. Note: real time mode sometimes shows doubled events and returning visitors appear only after a day or so of usage.
</script>

</body>
```

See it in action
------------------

See the ganc code in action on http://humane-tehnologije.si.

