<?php namespace ToChces\Repositories;

use ToChces\Models\Like;

class EloquentLikeRepository implements LikeRepository
{

	public function findByProduct(int $productId)
	{
		return Like::where('product', $productId)->orderBy('created_at', 'desc')->get();
	}

	public function findByUser(int $userId)
	{
		return Like::where('user', $userId)->orderBy('created_at', 'desc')->get();
	}

	public function create(array $input)
	{
		$like = Like::create($input);
		return $like;
	}

	public function createOrUpdate(array $input)
	{
		$like = Like::where('user_id', $input['user_id'])->where('product_id', $input['product_id'])->first();
		if ( $like && isset($input['owned']) ) {
			$like->owned = $input['owned'];
			$like->save();
		} else {
			$like = Like::create($input);
		}
		return $like;
	}

	public function setOwned(int $productId, int $userId, $owned)
	{
		$like = Like::where('product', $productId)->andWhere('user', $userId)->firstOrFail();
		$like->owned = $owned;
		$like->save();
		return $like;
	}

	public function destroy(int $productId, int $userId)
	{
		$like = Like::where('product', $productId)->andWhere('user', $userId)->firstOrFail();
		$like->delete();
	}

}