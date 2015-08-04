<?php namespace ToChces\Repositories;

interface LikeRepository
{

	public function findByProduct($productId);

	public function findByUser($userId);

	public function create(array $input);

	public function createOrUpdate(array $input);

	public function setOwned($productId, $userId, $owned);

	public function destroy($productId, $userId);

}