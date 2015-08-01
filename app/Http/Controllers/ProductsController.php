<?php namespace ToChces\Http\Controllers;

use ToChces\Repositories\ProductRepository;
use ToChces\Repositories\LikeRepository;
use ToChces\Models\Product;
use Sunra\PhpSimple\HtmlDomParser;
use Response;
use Request;
use Log;
use Input;
use Auth;

class ProductsController extends Controller {

	/** @var ProductRepository Products repository */
	protected $productRepository = null;

	/** @var LikeRepository Likes repository */
	protected $likeRepository = null;

	/**
	 * Create a new controller instance.
	 * @param ProductRepository $productRepository
	 * @param LikeRepository $likeRepository
	 */
	public function __construct(ProductRepository $productRepository, LikeRepository $likeRepository) {
		$this->productRepository = $productRepository;
		$this->likeRepository = $likeRepository;
	}

	/**
	 * Return products of all users
	 *
	 * @return Response
	 */
	public function all(){

		return Response::json(array(
			"products" => $this->productRepository->all()
		));
	}

	/**
	 * Returns products for selected user
	 * @param \ToChces\Models\User $user
	 * @return Response
	 */
	public function user($user) {
		return Response::json([
			'products' => $this->getProducts($user)
		]);
	}

	/**
	 * Returns products for current user
	 * @return Response
	 */
	public function profile() {
		return Response::json([
			'products' => $this->getProducts(Auth::user())
		]);
	}

	/**
	 * @param Product $product
	 * @return \Illuminate\View\View
	 */
	public function single(Product $product){
		$like = $product->like();
		if ($like){
			$product->liked = true;
			$product->owned = $like->owned;
		}
		return view('products/single', array(
			'product' => $product
		));
	}

	public function add(){
		return view('products/add');
	}

	public function addSubmit(){
		$data = Input::all();
		$data['added_by'] = Auth::user()->id;
		$data['approved'] = true;
		$this->productRepository->create($data);
		return response()->json(['path' => '/profile']);
	}

	public function getInfo()
	{
		$url = Request::query('url');
		if (!$url) {
			return $this->jsonError(400, 'Nebyl předán odkaz na internetovou stránku.');
		}

		try {
			$data = $this->makeRequestWithHeaders($url);
		} catch (\Exception $e) {
			Log::error($e);
			throw $e;
		}

		$contentType =  @$data['header']['content-type'] ? @$data['header']['content-type'] : '';
		if (strpos($contentType, 'text/html') === false) {
			return $this->jsonError(400, 'Zadaný odkaz nevede na internetovou stránku.');
		}


		$product = $this->parseHTML($url, @$data['body']);
		return response()->json(['product' => $product]);
	}

	public function getImage(){
		$url = Request::query('url');
		if (!$url) {
			return $this->jsonError(400, 'Nebyl předán odkaz na fotku.');
		}
		try {
			$file = $this->makeImageRequest($url);
		} catch (\Exception $e) {
			Log::error($e);
			return $this->jsonError(400, 'Bohužel se nám nepodařilo načíst fotku.');
		}
		return response()->json(['src' => '/download/'.$file]);
	}

	public function like(Product $product){
		$like = $this->likeRepository->createOrUpdate([
			'product_id' => $product->id,
			'user_id' => Auth::user()->id
		]);
		return $this->handleLikeChange($like);
	}

	public function dislike(Product $product){
		$this->likeRepository->destroy($product->id, Auth::user()->id);
		return $this->handleLikeChange();
	}

	public function own(Product $product){
		$like = $this->likeRepository->createOrUpdate([
			'product_id' => $product->id,
			'user_id' => Auth::user()->id,
			'owned' => true
		]);
		return $this->handleLikeChange($like);
	}

	public function disown(Product $product){
		$like = $this->likeRepository->createOrUpdate([
			'product_id' => $product->id,
			'user_id' => Auth::user()->id,
			'owned' => false
		]);
		return $this->handleLikeChange($like);
	}

	protected function handleLikeChange($like = null){
		if (Request::ajax()) return response()->json(['status' => 'success']);
		else return back();
	}

	protected function parseHTML($url, $html) {
		$parsedURL = parse_url($url);
		$dom = HtmlDomParser::str_get_html( $html );

		$product = new \stdClass();
		$product->name = $dom->find('title', 0)->plaintext;

		$product->images = [];
		foreach ($dom->find('img') as $image) {
			$url = $this->makeAbsolute($image->src, $parsedURL);
			if ($url) {
				$image = new \stdClass();
				$image->src = html_entity_decode($url);
				$product->images[] = $image;
			}
		}

		return $product;
	}

	protected function makeAbsolute($url, $parsedURL)
	{
		if(!$url) return null;

		// Return if already absolute URL
		if(parse_url($url, PHP_URL_SCHEME) != '') return $url;

		if(@$url[0] == '/' && @$url[1] == '/') return $parsedURL['scheme'] . ':' . $url;

		$scheme = isset($parsedURL['scheme']) ? $parsedURL['scheme'] : 'http';
		$host = $parsedURL['host'];
		$host .= isset($parsedURL['port']) && $parsedURL['port'] != 80 ? ':' . $parsedURL['port'] : '';

		$base = $scheme . '://' . $host;

		// Urls only containing query or anchor
		if($url[0] == '#' || $url[0] == '?') return $base.$url;

		$path = isset($parsedURL['path']) ? $parsedURL['path'] : '/';

		// Remove non-directory element from path
		$path = preg_replace('#/[^/]*$#', '', $path);

		// Destroy path if relative url points to root
		if($url[0] == '/') $path = '';

		// Dirty absolute URL
		$abs = "$host$path/$url";

		// Replace '//' or '/./' or '/foo/../' with '/'
		$re = array('#(/\.?/)#', '#/(?!\.\.)[^/]+/\.\./#');
		for($n = 1; $n > 0; $abs = preg_replace($re, '/', $abs, -1, $n)) {}

		// Absolute URL is ready!
		return $scheme.'://'.$abs;
	}

	private function getProducts($user = null) {
		$page = Input::query('page');
		$categories = Input::query('categories');
		if ($user) return $this->productRepository->byUser($user, $categories, $page);
		else return $this->productRepository->all($categories, $page);
	}

}
