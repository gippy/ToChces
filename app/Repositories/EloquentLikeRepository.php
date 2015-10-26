<?php namespace ToChces\Repositories;

use ToChces\Models\Like;

class EloquentLikeRepository implements LikeRepository
{

	public function findByProduct($productId)
	{
		return Like::with('user')->where('product_id', $productId)->orderBy('created_at', 'desc')->get();
	}

	public function findByUser($userId)
	{
		return Like::with('product')->where('user_id', $userId)->orderBy('created_at', 'desc')->get();
	}

	public function create(array $input)
	{
		$like = Like::create($input);
		return $like;
	}

	public function createOrUpdate(array $input)
	{
		$like = Like::where('user_id', $input['user_id'])->where('product_id', $input['product_id'])->first();
		if ( $like && isset($input['box_id']) ) {
			$like->box_id = $input['box_id'];
			$like->save();
		} else if ($like) {
			return $like;
		} else {
			$like = Like::create($input);
		}
		return $like;
	}

	public function setOwned($productId, $userId, $owned)
	{
		$like = Like::where('product_id', $productId)->where('user_id', $userId)->firstOrFail();
		$like->owned = $owned;
		$like->save();
		return $like;
	}

	public function destroy($productId, $userId)
	{
		$like = Like::where('product_id', $productId)->where('user_id', $userId)->firstOrFail();
		$like->delete();
	}

}