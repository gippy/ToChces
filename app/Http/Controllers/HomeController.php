<?php namespace ToChces\Http\Controllers;

use Storage;
use Response;
use App;
use Input;
use Session;
use ToChces\Repositories\TagRepository;

class HomeController extends Controller {

	/** @var TagRepository $tagRepository */
	protected $tagRepository = null;

	public function __construct(TagRepository $tagRepository){
		$this->tagRepository = $tagRepository;
	}

	/**
	 * Show the application dashboard to the user.
	 *
	 * @return Response
	 */
	public function index()
	{
		$this->middleware('auth');
		return view('home');
	}

	public function download($file) {
		$this->middleware('auth');
		$disk = Storage::disk('local');
		if ($disk->exists($file)) return response()->download(storage_path().'/app/'.$file);
		else App::abort(404);
	}

	public function categories(){
		$categories = $this->tagRepository->categories();
		return response()->json($categories);
	}

	public function saveCategories(){
		$activeCategories = explode(',', Input::get('ids', ''));
		Session::put('categories', $activeCategories);
		return back();
	}

}
