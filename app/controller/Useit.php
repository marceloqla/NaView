<?php

namespace app\controller;

use \app\utils\View;

class Useit extends Base{
	public static function getUseit(){
		$content = View::render('use');
		$header = "<script type='text/javascript' src='https://code.jquery.com/jquery-3.6.0.min.js'></script>\n<script type='text/javascript' src='public/js/fresco.min.js'></script>\n<link rel='stylesheet' type='text/css' href='public/style/fresco.css' />";

		return parent::getPage('NaView > Use it', $content, "", $header, "use");
	}
}