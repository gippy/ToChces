<?php namespace ToChces\Repositories;

interface SocialRepository
{

	public function find($platform, $platformId);

	public function create($platform, $input);

	public function getUser($platform, $platformId);

	public function createOrUpdate($platform, $input);
}