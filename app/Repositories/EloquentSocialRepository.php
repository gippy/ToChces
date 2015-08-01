<?php namespace ToChces\Repositories;

use ToChces\Models\Social;
use ToChces\Repositories\EloquentUserRepository as User;

class EloquentSocialRepository implements SocialRepository
{

	/**
	 * @param $platform - platform aka facebook, google, twitter
	 * @param $platformId - id of user on platform
	 * @return Social
	 */
	public function find($platform, $platformId)
	{
		return Social::where('platform', $platform)->where('platform_id', $platformId)->first();
	}

	/**
	 * @param $platform - Platform aka facebook, google, twitter
	 * @param $input - Values provided by platform
	 * @return Social
	 */
	public function create($platform, $input)
	{
		$social = Social::create($this->getSocialDetails($platform, $input));

		$user = $this->createUser($input);

		$social->user()->associate($user);
		$social->save();

		return $social;
	}

	/**
	 * @param $platform - platform aka facebook, google, twitter
	 * @param $platformId - id of user on platform
	 * @return \ToChces\Models\User|null
	 */
	public function getUser($platform, $platformId)
	{
		$social = $this->find($platform, $platformId);
		if (!$social) return null;
		else return $social->user;
	}

	public function createOrUpdate($platform, $input)
	{
		$social = $this->find($platform, $input->id);
		if ($social) {
			$user = $social->user;
			if (!$user) $user = $this->createUser($input);
			else $user->update($this->getUserDetails($input));
			$user->save();
			$social->user()->associate($user);
			$social->save();
		} else {
			$social = $this->create($platform, $input);
		}
		return $social;
	}

	protected function createUser($input)
	{
		$userRepo = new User();
		$user = $userRepo->findByEmail($input->email);
		$userDetails = $this->getUserDetails($input);

		if (!$user) $user = $userRepo->create($userDetails);
		else $user->update($userDetails);

		return $user;
	}

	private function getUserDetails($input)
	{
		$avatar = str_replace('sz=50', 'sz=100', $input->avatar);
		return [
			'name' => $input->name,
			'email' => $input->email,
			'image' => $avatar
		];
	}

	private function getSocialDetails($platform, $input)
	{
		return [
			'platform' => $platform,
			'platform_id' => $input->id
		];
	}

}