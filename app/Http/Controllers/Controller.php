<?php namespace ToChces\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesCommands;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Storage;

abstract class Controller extends BaseController {

	use DispatchesCommands, ValidatesRequests;

	protected function jsonError($code = 400, $message = 'Bad Request'){
		return \Response::json(['error' => $message])->header('Status', $code . $message);
	}

	protected function makeRequest($url) {
		$curl = curl_init();

		curl_setopt_array($curl, array(
			CURLOPT_RETURNTRANSFER => 1,
			CURLOPT_URL => $url,
			CURLOPT_USERAGENT => 'ToChcete API CURL Request'
		));
		$resp = curl_exec($curl);
		curl_close($curl);

		return $resp;
	}

	protected function makeRequestWithHeaders($url){

		$curl = curl_init();
		curl_setopt_array($curl, array(
			CURLOPT_RETURNTRANSFER => 1,
			CURLOPT_VERBOSE => 1,
			CURLOPT_HEADER => 1,
			CURLOPT_URL => $url,
			CURLOPT_USERAGENT => 'ToChcete API CURL Request'
		));

		$response = curl_exec($curl);

		$header_size = curl_getinfo($curl, CURLINFO_HEADER_SIZE);
		$header = substr($response, 0, $header_size);
		$body = substr($response, $header_size);

		return [
			'header' => $this->parseHeader($header),
			'body' => $body
		];
	}

	protected function makeImageRequest($url){
		$contentType = $this->getContentType($url);
		$extension = $this->getExtension($contentType);
		if (!$extension) {
			throw( new \Exception('Vybraný formát fotky není podporován.') );
		}
		$name = hash('sha256', $url) . $extension;
		$disk = Storage::disk('local');

		if (!$disk->exists($name)) {
			$this->downloadImage($url, $name, $disk);
		}

		return $name;
	}

	protected function getContentType($url){
		$curl = curl_init();
		curl_setopt_array($curl, array(
			CURLOPT_RETURNTRANSFER => 1,
			CURLOPT_VERBOSE => 1,
			CURLOPT_HEADER => 1,
			CURLOPT_URL => $url,
			CURLOPT_USERAGENT => 'ToChcete API CURL Request'
		));

		$response = curl_exec($curl);

		$header_size = curl_getinfo($curl, CURLINFO_HEADER_SIZE);
		curl_close($curl);

		$header = $this->parseHeader(substr($response, 0, $header_size));

		return $header['content-type'];
	}

	protected function parseHeader($header) {
		$lines = explode( "\r\n", $header );
		$headers = array();
		foreach($lines as $line) {
			if(strpos($line, 'HTTP') === 0) {
				$headers['status'] = $line;
				continue;
			} else if (!trim($line)) continue;

			list($key, $value) = explode(': ', $line);
			$headers[strtolower($key)] = $value;
		}
		return $headers;
	}

	protected function getExtension($contentType) {
		if (strpos($contentType, 'qif')) return '.gif';
		else if (strpos($contentType, 'jpeg')) return '.jpg';
		else if (strpos($contentType, 'png')) return '.png';
		else if (strpos($contentType, 'bmp')) return '.bmp';
		else return null;
	}

	protected function downloadImage($url, $name, $disk) {

		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_HEADER, 0);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($curl, CURLOPT_BINARYTRANSFER,1);
		curl_setopt($curl, CURLOPT_USERAGENT,  'ToChcete API CURL Request');
		$data=curl_exec ($curl);
		curl_close ($curl);

		$disk->put($name, $data);
	}

}
