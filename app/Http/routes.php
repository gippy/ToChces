<?php

Blade::setContentTags('{!', '!}');        // for variables and all things Blade
Blade::setEscapedContentTags('{!!', '!!}');   // for escaped data

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', 'WelcomeController@index');
Route::get('/terms', "WelcomeController@terms");

Route::get('/categories', 'HomeController@categories');
Route::get('/categories/save', 'HomeController@saveCategories');

Route::get('home', 'HomeController@index');

Route::get('download/{file}', 'HomeController@download');

Route::get('/auth/logout', [
	'as' => 'logout', 'uses' => 'Auth\AuthController@getLogout'
]);

Route::post('/auth/login', 'Auth\AuthController@login');
Route::post('/auth/register', 'Auth\AuthController@register');
Route::get('/auth/verify', 'Auth\AuthController@verify');

Route::get('/auth/{provider}', 'Auth\AuthController@redirectTo');
Route::get('/auth/{provider}/callback', 'Auth\AuthController@handleSocialCallback');

Route::controllers([
	'auth' => 'Auth\AuthController',
	'password' => 'Auth\PasswordController',
]);

Route::get('/users', 'UsersController@all');
Route::get('/user/{user}', 'UsersController@single');
Route::get('/user/{user}/products', 'ProductsController@user');

Route::get('/profile', [
	'as' => 'profile', 'uses' => 'UsersController@current'
]);

Route::get('/profile/products', 'ProductsController@profile');

Route::get('/settings', [
	'as' => 'settings', 'uses' => 'UsersController@settings'
]);

Route::get('/products', 'ProductsController@all');
Route::get('/product/{product}', 'ProductsController@single');
Route::get('/products/getInfo', 'ProductsController@getInfo');
Route::get('/products/getImage', 'ProductsController@getImage');

Route::get('/product/{product}/like', 'ProductsController@like');
Route::get('/product/{product}/dislike', 'ProductsController@dislike');
Route::get('/product/{product}/own', 'ProductsController@own');
Route::get('/product/{product}/disown', 'ProductsController@disown');
Route::post('/product/saveTempImage', 'ProductsController@saveTemp');

Route::get('/add', [
	'as' => 'addProduct', 'uses' => 'ProductsController@add'
]);
Route::post('/add', 'ProductsController@addSubmit');

Route::get('/modal/login', 'ModalController@login');
Route::get('/modal/register', 'ModalController@register');
Route::get('/modal/categories', 'ModalController@categories');
Route::get('/modal/login-email', 'ModalController@loginWithEmail');
