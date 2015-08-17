<?php

return [

	/*
	|--------------------------------------------------------------------------
	| Third Party Services
	|--------------------------------------------------------------------------
	|
	| This file is for storing the credentials for third party services such
	| as Stripe, Mailgun, Mandrill, and others. This file provides a sane
	| default location for this type of information, allowing packages
	| to have a conventional place to find your various credentials.
	|
	*/

	'mailgun' => [
		'domain' => env('MG_DOMAIN'),
		'secret' => env('MG_KEY'),
	],

	'mandrill' => [
		'secret' => '',
	],

	'ses' => [
		'key' => '',
		'secret' => '',
		'region' => 'us-east-1',
	],

	'stripe' => [
		'model'  => 'ToChces\User',
		'key' => '',
		'secret' => '',
	],

	'facebook' => [
	    'client_id' => env('FB_ID'),
	    'client_secret' => env('FB_SECRET'),
	    'redirect' => 'http://' . env('ADDRESS') . '/auth/facebook/callback',
	],

	'google' => [
	    'client_id' => env('G_ID'),
	    'client_secret' => env('G_SECRET'),
	    'redirect' => 'http://' . env('ADDRESS') . '/auth/google/callback',
	],

];
