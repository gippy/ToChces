<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ModifiedProductsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('products', function(Blueprint $table)
		{
			$table->string('layout')->default('square');
			$table->boolean('approved')->default(false);

			$table->string('vendor')->nullable()->change();
			$table->text('description')->nullable()->change();
			$table->string('price')->nullable()->change();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('products', function(Blueprint $table)
		{
			$table->dropColumn('layout');
			$table->dropColumn('approved');
			$table->string('vendor')->change();
			$table->text('description')->change();
			$table->string('price')->change();
		});
	}

}
