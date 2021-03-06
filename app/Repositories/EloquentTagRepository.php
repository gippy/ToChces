<?php namespace ToChces\Repositories;

use ToChces\Models\Tag;
use ToChces\Models\Product;

class EloquentTagRepository implements TagRepository
{

	public function all(){
		return Tag::all();
	}

	public function categories(){
		return Tag::where('primary', true)->get();
	}

	public function saveMultiple(Product $product, array $tags){
		$query = Tag::whereIn('name', $tags);
		$productTags = $query->get();
		$diffArray = $query->lists('name')->all();
		$newTags = array_diff($tags, $diffArray);

		$ids = [];
		foreach ($productTags as $tag){
			$ids[] = $tag->id;
		}
		foreach ($newTags as $name){
			$tag = new Tag;
			$tag->name = $name;
			$tag->primary = false;
			$tag->save();
			$ids[] = $tag->id;
		}
		$product->tags()->sync($ids);
	}

}