<?php namespace ToChces\Http\Controllers;

use ToChces\Repositories\BoxRepository;
use ToChces\Models\User;
use Illuminate\Support\Facades\Auth;
use Response;
use Request;

class BoxesController extends Controller {

	/** @var BoxRepository Boxes repository **/
	protected $userRepository = null;

	/** @var User $user */
	protected $user = null;

	/**
	 * Create a new controller instance.
	 * @param BoxRepository $boxRepository
	 */
	public function __construct(BoxRepository $boxRepository){
		$this->boxRepository = $boxRepository;
		$this->user = Auth::user();
	}

	public function all() {
		return Response::json($this->boxRepository->owned($this->user->id));
	}

	public function merge(){
		$a = Request::input('to');
		$b = Request::input('from');
		$userId = $this->user->id;
		$this->boxRepository->merge($userId, $a, $b);
		Response::json([]);
	}

	public function create() {
		$params = [
			"name" => Request::input('name'),
			"color" => Request::input('color')
		];
		$userId = $this->user->id;
		$box = $this->boxRepository->create($userId, $params);
		return Response::json($box);
	}

	public function update() {
		$params = [
			"name" => Request::input('name'),
			"color" => Request::input('color')
		];
		$id = Request::input('id');
		$userId = $this->user->id;
		$box = $this->boxRepository->update($userId, $id, $params);
		return Response::json($box);
	}

	public function remove() {
		$box = Request::input('box');
		$this->boxRepository->remove($box);
		return Response::json([ "removed" => $box ]);
	}

	public function removeContents(){
		$box = Request::input('box');
		$userId = $this->user->id;
		$this->boxRepository->removeContents($userId, $box);
		return Response::json([]);
	}

}
