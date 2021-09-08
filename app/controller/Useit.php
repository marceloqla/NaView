<?php

namespace app\controller;

use \app\utils\View;

class Useit extends Base{
	public static function getUseit(){
		$content = View::render('use');

		return parent::getPage('NaView > Use it', $content, "", "use");
	}
}