<?php

namespace app\controller;

use \app\utils\View;

class About extends Base{
	public static function getAbout(){
		$content = View::render('about');

		return parent::getPage('NaView > About', $content, "", "", "about");
	}
}