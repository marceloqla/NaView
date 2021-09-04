<?php

use app\http\Response;
use app\controller;

$obRouter->get('/',[
	function(){
		return new Response(200, controller\Home::getHome());
	}
]);

$obRouter->get('/about',[
	function(){
		return new Response(200, controller\About::getAbout());
	}
]);

$obRouter->get('/contact',[
	function(){
		return new Response(200, controller\Contact::getContact());
	}
]);

$obRouter->get('/protein/{proteinId}',[
	function($proteinId ){
		return new Response(200, "Protein ".$proteinId );
	}
]);