<?php namespace ToChces\Http\Controllers;

use ToChces\Repositories\UserRepository;

class UsersController extends Controller {

	/** @var UserRepository Users repository **/
	protected $userRepository = null;

	/**
	 * Create a new controller instance.
	 *
	 * @return void
	 */
	public function __construct(UserRepository $userRepository)
		$this->userRepository = $userRepository;
	}

	/**
	 * Show the application dashboard to the user.
	 *
	 * @return Response
	 */
	public function list()
	{
		return Response::json(array(
			"users" => $this->userRepository->all();
		));
	}

	public function single(Product $user)
	{
		return view('users/user', array(
			'user' => $user
		));
	}

}
