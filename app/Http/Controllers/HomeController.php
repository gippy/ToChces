<?php namespace ToChces\Http\Controllers;

use Storage;
use Response;
use App;

class HomeController extends Controller {

	/*
	|--------------------------------------------------------------------------
	| Home Controller
	|--------------------------------------------------------------------------
	|
	| This controller renders your application's "dashboard" for users that
	| are authenticated. Of course, you are free to change or remove the
	| controller as you wish. It is just here to get your app started!
	|
	*/

	public function __construct() {
		$this->middleware('auth');
	}

	/**
	 * Show the application dashboard to the user.
	 *
	 * @return Response
	 */
	public function index()
	{
		return view('home');
	}

	public function download($file) {
		$disk = Storage::disk('local');
		if ($disk->exists($file)) return response()->download(storage_path().'/app/'.$file);
		else App::abort(404);
	}

}
