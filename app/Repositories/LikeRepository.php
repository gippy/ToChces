<?php namespace ToChces\Repositories;
 
interface LikeRepository {
   
  public function findByProduct(int $productId);
 
  public function findByUser(int $userId);
 
  public function create(array $input);

  public function setOwned(int $productId, int $userId, $owned);

  public function destroy(int $productId, int $userId);
 
}