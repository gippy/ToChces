<?php namespace ToChces\Repositories;
 
interface ProductRepository {
   
  public function all();
 
  public function find(int $id);
 
  public function create(array $input);

  public function update(int $id, array $input);

  public function getLikes(int $id);

  public function destroy(int $id);
 
}