<?php namespace ToChces\Http\Controllers;

use ToChces\Repositories\UserRepository;
use ToChces\Models\User;
use Illuminate\Support\Facades\Auth;
use Response;

class UsersController extends Controller {

	/** @var UserRepository Users repository **/
	protected $userRepository = null;

	/**
	 * Create a new controller instance.
	 * @param UserRepository $userRepository
	 */
	public function __construct(UserRepository $userRepository){
		$this->userRepository = $userRepository;
	}

	/**
	 * Show the application dashboard to the user.
	 *
	 * @return Response
	 */
	public function all() {
		return Response::json(array(
			"users" => $this->userRepository->all()
		));
	}

	public function single(User $user)
	{
		return view('users/single', array(
			'user' => $user
		));
	}

	public function current() {
		$user = Auth::user();
		return view('users/current', array(
			'user' => $user
		));
	}

	public function settings(){

	}

}
