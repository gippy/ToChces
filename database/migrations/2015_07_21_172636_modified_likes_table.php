<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ModifiedLikesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('likes', function(Blueprint $table)
		{
			$table->renameColumn('user', 'user_id');
			$table->renameColumn('product', 'product_id');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('products', function (Blueprint $table) {
			$table->renameColumn('user_id', 'user');
			$table->renameColumn('product_id', 'product');
		});
	}

}
