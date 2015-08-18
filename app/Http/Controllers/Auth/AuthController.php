<?php namespace ToChces\Http\Controllers\Auth;

use ToChces\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;
use ToChces\Repositories\SocialRepository;
use ToChces\Repositories\UserRepository;
use Session;
use Auth;
use Socialize;
use Request;
use Mail;
use Crypt;

class AuthController extends Controller {

	/** @var SocialRepository $socialRepo social repository */
	protected $socialRepo = null;

	/** @var UserRepository $userRepo user repository */
	protected $userRepo = null;

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
	 * @param  UserRepository $userRepository
	 */
	public function __construct(SocialRepository $socialRepository, UserRepository $userRepository)
	{
		$this->socialRepo = $socialRepository;
		$this->userRepo = $userRepository;
	}

	public function register(){
		if (!Request::has('email') || !Request::has('name') || !Request::has('password') || !Request::has('confirmation')){
			return response()->json(['error' => "Doplňte chybějící údaje."], 403);
		}

		$email = Request::input('email');
		$password = Request::input('password');
		$confirmation = Request::input('confirmation');

		if ($password != $confirmation) {
			return response()->json(['error' => "Zadaná hesla se neshodují."], 403);
		}

		if (Auth::attempt(['email' => $email, 'password' => $password, 'active' => true], true)) {
			return response()->json([
				'success' => 'already_authenticated',
				'redirect' => '/profile'
			]);
		}

		$existingUser = $this->userRepo->findByEmail($email);
		if ($existingUser) {
			return response()->json(['error' => "Účet se zadaným emailem již je na platformě založen."], 403);
		}

		$user = $this->userRepo->create([
			'name' => Request::input('name'),
			'email' => $email,
			'password' => $password
		]);

		$user->verification = Crypt::encrypt('tochcete' . $email);
		$user->save();

		$verificationLink = 'http://' . env('ADDRESS') . '/auth/verify?code=' . $user->verification;

		Mail::send('emails.verify', [
			'user' => $user,
			'password' => $password,
			'link' => $verificationLink
		], function ($m) use ($user) {
			$m->to($user->email, $user->name)->subject('Váš účet na platformě ToChcete!');
		});

		return response()->json(['success' => 'Registrace byla dokončena. Na Váš email byl zaslán ověřovací email.']);
	}

	public function verify(){
		$token = Request::input('code');
		$user = $this->userRepo->findByVerification($token);
		if (!$user) {
			abort(403, 'Cannot find user associated with this verification link.');
		} else {
			$user->verification = null;
			$user->active = true;
			$user->save();
			Auth::login($user);
			return redirect()->intended('/');
		}
	}

	public function login() {
		if (!Request::has('email') || !Request::has('password')){
			return response()->json(['error' => "Doplňte chybějící údaje."], 403);
		}
		$email = Request::input('email');
		$password = Request::input('password');

		if (Auth::attempt(['email' => $email, 'password' => $password, 'active' => true], true)) {
			return response()->json([
				'success' => 'Přihlášení proběhlo v pořádku',
				'redirect' => '/profile'
			]);
		} else {
			return response()->json(['error' => "Nepodařilo se nám najít uživatele se zadanými údaji."], 403);
		}
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
		Auth::login($user, true);

		return redirect('/');
	}

}
