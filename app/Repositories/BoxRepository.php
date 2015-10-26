<?php namespace ToChces\Repositories;

interface BoxRepository
{

	public function all();

	public function owned($userId);

	public function merge($userId, $boxAId, $boxBId);

	public function remove($boxId);
	public function removeContents($userId, $boxId);
	public function create($userId, array $params);
	public function update($userId, $boxId, array $params);
}