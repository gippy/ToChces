<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddedPrimaryKeyToLikes extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('likes', function(Blueprint $table)
		{
			$table->primary(['product_id', 'user_id']);
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('likes', function(Blueprint $table)
		{
			$table->dropPrimary('likes_id_primary');
		});
	}

}
