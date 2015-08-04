<?php namespace ToChces\Repositories;

use ToChces\Models\Product;

interface TagRepository
{

	public function all();

	public function categories();

	public function saveMultiple(Product $product, array $tags);
}