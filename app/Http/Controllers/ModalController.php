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

	public function loginWithEmail()
	{
		return view('modals/login-email');
	}

	public function register()
	{
		return view('modals/register');
	}

	public function editBox()
	{
		return view('modals/edit-box');
	}

	public function boxes()
	{
		return view('modals/boxes');
	}

}
