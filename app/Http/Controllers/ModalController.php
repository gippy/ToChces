<?php namespace ToChces\Http\Controllers;

class ModalController extends Controller {

	public function categories()
	{
		return view('modals/categories');
	}

	public function login()
	{
		return view('modals/login');
	}

}
