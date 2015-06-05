<?php

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

Route::get('home', 'HomeController@index');

Route::get('/auth/facebook', 'AuthController@redirectToFacebook');
Route::get('/auth/facebook/callback', 'AuthController@handleFacebookCallback');
Route::get('/auth/google', 'AuthController@redirectToGoogle');
Route::get('/auth/google/callback', 'AuthController@handleGoogleCallback');

Route::controllers([
	'auth' => 'Auth\AuthController',
	'password' => 'Auth\PasswordController',
]);

Route::get('/users', 'UsersController@list');
Route::get('/user/{user}', 'UsersController@single');

Route::get('/products', 'ProductsController@list');
Route::get('/product/{product}', 'ProductsController@single');
