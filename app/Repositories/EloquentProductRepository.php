<?php namespace ToChces\Repositories;

use ToChces\Models\Product;
use ToChces\Models\User;
use ToChces\Models\Like;

class EloquentProductRepository implements ProductRepository
{
	protected $limit = 50;

	public function all($page = -1, $categories = '')
	{
		$query = Product::with('likes')->whereNotNull('added_by');
		if ($page != -1) {
			$query = $query->skip($this->limit * $page)->take($this->limit);
		}
		return $query->orderBy('created_at', 'desc')->get();
	}

	public function byUser(User $user, $page = -1, $categories = '')
	{
		$query = Like::with('product')->where('user_id', $user->id);
		if ($page != -1) {
			$query = $query->skip($this->limit * $page)->take($this->limit);
		}
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

}