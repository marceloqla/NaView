<?php

namespace app\controller;

use \app\utils\View;

class Contact extends Base{
	public static function getContact(){
		$content = View::render('contact');

		return parent::getPage('NaView > Contact', $content, "", "contact");
	}
}