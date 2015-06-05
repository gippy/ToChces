<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLikesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('likes', function(Blueprint $table)
		{
			$table->integer('user')->unsigned();
			$table->foreign('user')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
			$table->integer('product')->unsigned();
			$table->foreign('product')->references('id')->on('products')->onUpdate('cascade')->onDelete('cascade');
			$table->boolean('owned')->default(false);
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('likes');
	}

}
