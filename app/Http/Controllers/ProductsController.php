<?php namespace ToChces\Http\Controllers;

use ToChces\Repositories\ProductRepository;

class ProductsController extends Controller {

	/** @var ProductRepository Products repository */
	protected $productRepository = null;

	/**
	 * Create a new controller instance.
	 * @param ProductRepository @productRepository
	 * @return void
	 */
	public function __construct(ProductRepository $productRepository) {
		$this->productRepository = $productRepository;
	}

	/**
	 * Show the application dashboard to the user.
	 *
	 * @return Response
	 */
	public function list(){
		return Response::json(array(
			"products" => $this->productRepository->pagedApproved( Input::get('page', 0) );
		));
	}

	public function single(Product $product){
		return view('products/product', array(
			'product' => $product
		));
	}

}
