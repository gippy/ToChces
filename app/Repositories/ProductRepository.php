<?php namespace ToChces\Repositories;

use ToChces\Models\User;

interface ProductRepository
{

	public function all($page = 0, $categories = '');

	public function byUser(User $user, $page = 0, $categories = '');

	public function find(int $id);

	public function create(array $input);

	public function update(int $id, array $input);

	public function getLikes(int $id);

	public function destroy(int $id);

}