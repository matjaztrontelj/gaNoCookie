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
 
//Cookie functions taken from http://www.quirksmode.org/js/cookies.html
function gaNoCookieCreateCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function gaNoCookieReadCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function gaNoCookieEraseCookie(name) {
	gaNoCookieCreateCookie(name,"",-1);
}
//end cookie functions

var gaNoCookieTrunc = function(s, len) {
	if(s.length > len) {
	    return s.substring(0,len-1);
	}
	return s;
}

var gaNoCookieGetScreenSize = function() {
	var dpr = window.devicePixelRatio ? window.devicePixelRatio : 1;
	return screen.width * dpr + 'x' + screen.height * dpr;
}

var gaNoCookieGetViewportSize = function() {
    if(!document.documentElement || !document.documentElement.clientWidth) return "";
	return document.documentElement.clientWidth + 'x' + document.documentElement.clientHeight;
}

var gaNoCookieGetLanguage = function() {
	return navigator.language || navigator.userLanguage;
}

var gaNoCookieGetCampaignData = function() {
	//parameter parsing from http://stackoverflow.com/a/2880929
	var urlParams;
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
	//end parsing
	
	var d = '';
	if(urlParams['utm_campaign']) d += 'cn=' + encodeURIComponent(urlParams['utm_campaign']) + '&';
	if(urlParams['utm_source']) d += 'cs=' + encodeURIComponent(urlParams['utm_source']) + '&';
	if(urlParams['utm_medium']) d += 'cm=' + encodeURIComponent(urlParams['utm_medium']) + '&';
	
	return d;
}

var gaNoCookieSendHit = function(tid, t, data) {
    var z = parseInt(Math.random()*99999999);
    var uid = window.gaNoCookieUid;
    data = gaNoCookieGetCampaignData() + data;
    var url = 'http://www.google-analytics.com/collect?payload_data&v=1&aip=1&z=' + z + '&tid=' + tid + '&cid=' + uid + '&t=' + t + '&sr=' + gaNoCookieGetScreenSize() + '&vp=' + gaNoCookieGetViewportSize() + '&ul=' + gaNoCookieGetLanguage() + '&' + data;	
	var img = document.createElement('img');
	img.setAttribute('src', url);
	document.body.appendChild(img);
}

var gaNoCookieSendPageView = function(tid) {
	var page = encodeURIComponent(window.location.pathname);
    var title = encodeURIComponent(gaNoCookieTrunc(document.title, 100));
    var ref =  document.referrer ? encodeURIComponent(gaNoCookieTrunc(document.referrer, 500)) : '';
    var data = 'dp=' + page + '&dt=' + title + '&dr=' + ref + '&';
    gaNoCookieSendHit(tid, 'pageview', data);
}

var gaNoCookieSendEvent = function(tid, ec, ea, el) {
	if(typeof el == 'undefined') el = "";
	ec = encodeURIComponent(ec);
	ea = encodeURIComponent(ea);
	el = encodeURIComponent(el);
    var data = 'ec=' + ec + '&ea=' + ea + '&el=' + el + '&';
    gaNoCookieSendHit(tid, 'event', data);
}

var gaNoCookieProcessQueue = function() {
	if(!window['GoogleNoCookieAnalyticsObject']) return;
	var name = window['GoogleNoCookieAnalyticsObject'];
	var q = window[name].q;
	if(!window['gaNoCookieUid']) return;
	if(!gaNoCookieIsEnabled()) return;
	
	for(var n = 0; n < q.length; n++) {
		var args = q[n];
		if(args.length == 0) continue;
		var cmd = args[0];
		
		if(cmd == 'create') {
			if(args.length < 2) continue;
			gaNoCookieTrackerId = args[1];
		} else if(cmd == 'send') {
			if(!window['gaNoCookieTrackerId']) continue;
			if(args.length < 2) continue;
			var t = args[1];
			
			if(t == 'pageview') {
				gaNoCookieSendPageView(gaNoCookieTrackerId);
			} else if(t == 'event') {
				if(args.length < 4) continue;
				var ec = args[2];
				var ea = args[3];
				var el = args.length > 4 ? args[4] : "";
				gaNoCookieSendEvent(gaNoCookieTrackerId, ec, ea, el);
			}
		}
	}
	q.length = 0;
}

var gaNoCookieIsEnabled = function() {
	if(gaNoCookieStatus == "") {
		var dis = gaNoCookieReadCookie(gaNoCookieStatusCookie);
		gaNoCookieStatus = dis ? 0 : 1;
	}
	return gaNoCookieStatus;
}

var gaNoCookieDisable = function() {
	if(window['gaNoCookieTrackerId']) {
		gaNoCookieSendEvent(window['gaNoCookieTrackerId'], 'GA', 'DISABLED'); 
	}
	gaNoCookieCreateCookie(gaNoCookieStatusCookie, "1", 365);
	gaNoCookieStatus = 0;
	gaNoCookieStatusUI();
}

var gaNoCookieEnable = function() {
	gaNoCookieEraseCookie(gaNoCookieStatusCookie);
	gaNoCookieStatus = 1;
	gaNoCookieStatusUI();
	if(window['gaNoCookieTrackerId']) {
		gaNoCookieSendEvent(window['gaNoCookieTrackerId'], 'GA', 'ENABLED'); 
	}
}

var gaNoCookieStatusUI = function() {
	if(!window['ganc_status_eid']) return;
	var m = document.getElementById(ganc_status_eid);
	if(!m) return;
	var html = '';
	if(gaNoCookieIsEnabled()) {
		html = '<a href="#" onclick="gaNoCookieDisable();return false;">' + ganc_status_on + '</a>';
	} else {
		html = '<a href="#" onclick="gaNoCookieEnable();return false;">' + ganc_status_off + '</a>';
	}
	m.innerHTML = html;
}

var gaNoCookieTrackerId = null;
var gaNoCookieStatusCookie = "gaNoCookieDisabled";
var gaNoCookieStatus = "";
var gaNoCookieGetUidUrl = window['gancGetUidUrl'] ? window['gancGetUidUrl'] : '/ga_no_cookie_uid.php';

var a = document.createElement('script');
var m = document.getElementsByTagName('script')[0];
a.async = 1;
a.src = gaNoCookieGetUidUrl + '?ss=' + gaNoCookieGetScreenSize() + '&z=' + parseInt(Math.random()*99999999);
m.parentNode.insertBefore(a,m);

gaNoCookieStatusUI();

setInterval(function() { gaNoCookieProcessQueue();}, 100);