<?php

namespace app\controller;

use \app\utils\View;

class Base{
	public static function getPage($title, $content, $footer=""){
		return View::render('base', [
			'title' => $title,
			'content' => $content,
			'footer' => $footer
		]);
	}
}