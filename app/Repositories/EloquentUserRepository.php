<?php namespace ToChces\Repositories;

use ToChces\Models\User;
use ToChces\Models\Product;

class EloquentUserRepository implements UserRepository
{

	public function all()
	{
		return User::orderBy('created_at', 'desc')->get();
	}

	public function find($id)
	{
		return User::find($id);
	}

	public function create(array $input)
	{
		$user = User::create($input);
		if (@$input['password']) $user->setPassword($input['password']);
		$user->save();

		return $user;
	}

	public function update($id, array $input)
	{
		$user = User::findOrFail($id);
		$user->update($input);
		return $user;
	}

	public function getLikes($id)
	{

	}

	public function getProducts($id)
	{
		return Product::where('added_by', $id)->get();
	}

	public function destroy($id)
	{
		User::destroy($id);
	}

	/**
	 * Find an user by it's email.
	 *
	 * @param  string $email
	 * @return \ToChces\Models\User
	 */
	public function findByEmail($email)
	{
		return User::whereEmail($email)->first();
	}

	/**
	 * Find an user by his verification token.
	 * @param $verification
	 * @return mixed
	 */
	public function findByVerification($verification){
		return User::where('verification', $verification)->first();
	}


}