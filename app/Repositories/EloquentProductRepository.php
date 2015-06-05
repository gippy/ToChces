<?php namespace ToChces\Repositories;

use ToChces\Models\Product;
 
class EloquentProductRepository implements ProductRepository {
 
  public function all(){
    return Product::orderBy('created_at', 'desc')->get();
  }

  public function find(int $id){
    return Product::find($id);
  }
 
  public function create(array $input){
    $product = Product::create($input);
    return $product;
  }

  public function update(int $id, array $input){
    $product = Product::findOrFail($id);
    $product->update($input);
    return $product;
  }

  public function getLikes(int $id){

  }
  
  public function destroy(int $id){
    Product::destroy($id);
  }
 
}