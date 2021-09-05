<?php

namespace app\http;

class Request{
	private $httpMethod;
	private $uri;
	private $getParams = [];
	private $postParams = [];
	private $headers = [];

	public function __construct(){
		$this->getParams = isset($_GET) ? $_GET : [];
		$this->postParams = isset($_POST) ? $_POST : [];
		$this->headers = getallheaders();
		$this->httpMethod = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : '';
		$this->uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
	}

	public function getHttpMethod(){
		return $this->httpMethod;
	}
	public function getUri(){
		return $this->uri;
	}
	public function getGetParams(){
		return $this->getParams;
	}
	public function getPostParams(){
		return $this->postParams;
	}
	public function getHeaders(){
		return $this->headers;
	}
}