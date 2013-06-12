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

function getUserIpAddr()
{
	//code from http://stackoverflow.com/a/3358212
    if (!empty($_SERVER['HTTP_CLIENT_IP']))
    {
        return $_SERVER['HTTP_CLIENT_IP'];
    }
    else if (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))
    {
        return $_SERVER['HTTP_X_FORWARDED_FOR'];
    }
    else if(!empty($_SERVER['REMOTE_ADDR']))
    {
        return $_SERVER['REMOTE_ADDR'];
    }
    return "UnknownIP";
}

function getBrowserAndPlatform() {
	$ua = !empty($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : "";
	
	$browser = "UnknownBrowser";
	if(stripos($ua, "MSIE") !== false) {
		$browser = "MSIE";
	} elseif(stripos($ua, "Safari") !== false) {
		$browser = "Safari";
	} elseif(stripos($ua, "Chrome") !== false) {
		$browser = "Chrome";
	} elseif(stripos($ua, "Firefox") !== false) {
		$browser = "Firefox";
	}
	
	$os = "UnknownOS";
	if(stripos($ua, "Win") !== false) {
		$os = "Windows";
	} elseif(stripos($ua, "Mac") !== false) {
		$os = "Mac";
	} elseif(stripos($ua, "X11") !== false) {
		$os = "Unix";
	} elseif(stripos($ua, "Linux") !== false) {
		$os = "Linux";
	} elseif(stripos($ua, "iPhone") !== false) {
		$os = "iPhone";
	} elseif(stripos($ua, "iPad") !== false) {
		$os = "iPad";
	} elseif(stripos($ua, "iPod") !== false) {
		$os = "iPod";
	}
	return $browser.$os;
}

function getScreenSize() {
	return !empty($_GET['ss']) ? $_GET['ss'] : "UnknownSize";
}

function getUserId() {
	return md5(getUserIpAddr().getBrowserAndPlatform().getScreenSize());
}

header('Content-Type: text/javascript');
$ip = getUserId();
echo "window['gaNoCookieUid'] = '{$ip}';";
die();
?>