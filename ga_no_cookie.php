<?php
/*
 * Created by Matjaz Trontelj
 * 
 * Copyright (c) 2013 Humane Technologies LLC
 * 
 * Licensed under Attribution-NonCommercial 3.0 Unported, http://creativecommons.org/licenses/by-nc/3.0/
 * 
 * You are free to use this software on non-commercial projects.
 * 
 * Please visit http://humane-tehnologije.si/google-analytics-without-cookies for commercial licensing
 * 
 */

//serve javascript file with caching
$etag = !empty($_SERVER['HTTP_IF_NONE_MATCH']) ? trim($_SERVER['HTTP_IF_NONE_MATCH']) : false;
$last_modified = !empty($_SERVER['HTTP_IF_MODIFIED_SINCE']) ? trim($_SERVER['HTTP_IF_MODIFIED_SINCE']) : 0;
 
if(!empty($etag) || !empty($last_modified)) {
	header('Not Modified',true,304);
	die();
}

$etag = md5("We use ETag just for caching, not tracking!");

header('Content-Type: text/javascript');
header('Expires: ' . gmdate('D, d M Y H:i:s', time()+365*24*3600) . ' GMT');
header('ETag: "' . $etag . '"');

require 'ga_no_cookie_min.js';
?>