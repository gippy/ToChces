<?php namespace ToChces\Repositories;

use ToChces\Models\Product;
use ToChces\Models\User;
use ToChces\Models\Like;
use Session;
use DB;
use Input;

class EloquentProductRepository implements ProductRepository
{
	protected $limit = 50;

	public function all($page = -1) {
		$query = Product::with('likes');

		$categories = $this->getActiveCategories();
		if (count($categories) > 0) {
			$query = $query->join('tag_product', 'tag_product.product_id', '=', 'products.id')->whereIn('tag_product.tag_id', $categories);
		}
		$query = $query->whereNotNull('added_by');
		if ($page != -1) {
			$query = $query->skip($this->limit * $page)->take($this->limit);
		}

		$search = Input::get('search', '');
		if ($search) {
			$query = $query->where("name", 'like', "%$search%")
				->orWhere("url",'like', "%$search%")
				->orWhere("description",'like', "%$search%")
				->orWhere("vendor",'like', "%$search%");
		}

		$result = $query->orderBy('created_at', 'desc')->get();
		return $result;
	}

	public function byUser(User $user, $page = -1){
		$query = Like::with('product');

		$categories = $this->getActiveCategories();
		if (count($categories) > 0) {
			$query = $query->join('tag_product', 'tag_product.product_id', '=', 'likes.product_id')->whereIn('tag_product.tag_id', $categories);
		}

		if ($page != -1) {
			$query = $query->skip($this->limit * $page)->take($this->limit);
		}

		$query = $query->where('user_id', $user->id);
		$items = $query->orderBy('created_at', 'desc')->get();

		$products = [];
		foreach ($items as $item){
			$product = $item->product;
			$product->liked = true;
			$product->owned = $item->owned;
			$products[] = $product;
		}
		return $products;
	}

	public function find(int $id)
	{
		return Product::find($id);
	}

	public function create(array $input)
	{
		$product = Product::create($input);
		$like = new Like();
		$like->user_id = $input['added_by'];
		$like->product_id = $product->id;
		$like->save();
		return $product;
	}

	public function update(int $id, array $input)
	{
		$product = Product::findOrFail($id);
		$product->update($input);
		return $product;
	}

	public function getLikes(int $id)
	{

	}

	public function destroy(int $id)
	{
		Product::destroy($id);
	}

	protected function getActiveCategories(){
		$activeCategories = [];
		foreach (Session::get('categories', []) as $category){
			if ($category) $activeCategories[] = $category;
		}
		return $activeCategories;
	}

}