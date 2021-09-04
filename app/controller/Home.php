<?php

namespace app\controller;

use \app\utils\View;

class Home extends Base{
	public static function getHome(){
		$content = View::render('home');
		$footer = '<script src="public/js/home.js"></script>';

		return parent::getPage('NaView > Home', $content, $footer);
	}
}