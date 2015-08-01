<?php namespace ToChces\Http\Controllers\Auth;

use ToChces\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Auth\Registrar;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;
use ToChces\Repositories\SocialRepository;
use Session;
use Auth;
use Socialize;

class AuthController extends Controller {

	/** @var SocialRepository $socialRepo social repository */
	protected $socialRepo = null;

	/*
	|--------------------------------------------------------------------------
	| Registration & Login Controller
	|--------------------------------------------------------------------------
	|
	| This controller handles the registration of new users, as well as the
	| authentication of existing users. By default, this controller uses
	| a simple trait to add these behaviors. Why don't you explore it?
	|
	*/

	use AuthenticatesAndRegistersUsers;

	/**
	 * Create a new authentication controller instance.
	 *
	 * @param  SocialRepository $socialRepository
	 * @param  \Illuminate\Contracts\Auth\Guard  $auth
	 * @param  \Illuminate\Contracts\Auth\Registrar  $registrar
	 */
	public function __construct(SocialRepository $socialRepository, Guard $auth, Registrar $registrar)
	{
		$this->socialRepo = $socialRepository;
		$this->auth = $auth;
		$this->registrar = $registrar;
	}

	public function getLogout(){
		$this->middleware('auth');
		Auth::logout();
		Session::flush();
		return redirect('/');
	}

	public function redirectTo($provider)
	{
		$this->middleware('guest');
	    return Socialize::with($provider)->redirect();
	}

	public function handleSocialCallback($provider)
	{
		$this->middleware('guest');
	    $userData = Socialize::with($provider)->user();
		$social = $this->socialRepo->createOrUpdate($provider, $userData);
	    $user = $social->user;
		$this->auth->login($user, true);

		return redirect('/');
	}

}
