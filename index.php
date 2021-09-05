<?php
require_once("vendor/autoload.php");

use app\http\Router;
use app\utils\View;

define("URL", "http://localhost:8080/naview");
#define("URL", "http://bioinfo.icb.ufmg.br/naview");

 View::init([
 	'URL' => URL
 ]);

$obRouter = new Router(URL);

include __DIR__.'/routes/pages.php';


$obRouter->run()->sendResponse();