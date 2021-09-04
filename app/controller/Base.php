<?php

namespace app\controller;

use \app\utils\View;

class Base{
	public static function getPage($title, $content, $footer="", $active="home"){
		$home_class = $active == 'home' ? "active" : "";
		$about_class = $active == 'about' ? "active" : "";
		$contact_class = $active == "contact" ? "active" : "";
		return View::render('base', [
			'title' => $title,
			'content' => $content,
			'footer' => $footer,
			'home_class' => $home_class,
			'about_class' => $about_class,
			'contact_class' => $contact_class
		]);
	}
}