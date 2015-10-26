<?php namespace ToChces\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider {

	/**
	 * Bootstrap any application services.
	 *
	 * @return void
	 */
	public function boot()
	{
		$this->bootRepositories();
	}

	public function bootRepositories()
	{
		$this->app->bind(
			'ToChces\Repositories\UserRepository',
			'ToChces\Repositories\EloquentUserRepository'
		);

		$this->app->bind(
			'ToChces\Repositories\ProductRepository',
			'ToChces\Repositories\EloquentProductRepository'
		);

		$this->app->bind(
			'ToChces\Repositories\LikeRepository',
			'ToChces\Repositories\EloquentLikeRepository'
		);

		$this->app->bind(
			'ToChces\Repositories\SocialRepository',
			'ToChces\Repositories\EloquentSocialRepository'
		);

		$this->app->bind(
			'ToChces\Repositories\TagRepository',
			'ToChces\Repositories\EloquentTagRepository'
		);
		$this->app->bind(
			'ToChces\Repositories\BoxRepository',
			'ToChces\Repositories\EloquentBoxRepository'
		);
	}

	/**
	 * Register any application services.
	 *
	 * This service provider is a great spot to register your various container
	 * bindings with the application. As you can see, we are registering our
	 * "Registrar" implementation here. You can add your own bindings too!
	 *
	 * @return void
	 */
	public function register()
	{
		$this->app->bind(
			'Illuminate\Contracts\Auth\Registrar',
			'ToChces\Services\Registrar'
		);
	}

}
