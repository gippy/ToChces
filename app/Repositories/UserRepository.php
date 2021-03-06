<?php namespace ToChces\Repositories;

interface UserRepository
{

	public function all();

	public function find($id);

	public function create(array $input);

	public function update($id, array $input);

	public function getLikes($id);

	public function getProducts($id);

	public function destroy($id);

	public function findByEmail($email);

	public function findByVerification($verification);

}