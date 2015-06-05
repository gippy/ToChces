<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('products', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('url');
			$table->string('name');
			$table->string('vendor');
			$table->text('description');
			$table->string('price');
			$table->string('image');
			$table->integer('added_by')->unsigned()->nullable();
			$table->foreign('added_by')->references('id')->on('users')->onUpdate('cascade')->onDelete('set null');
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
		Schema::drop('products');
	}

}
