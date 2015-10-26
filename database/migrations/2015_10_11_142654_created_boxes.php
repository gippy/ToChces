<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatedBoxes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('boxes', function(Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('color', 60);
            $table->boolean('basic')->default(false);
	        $table->integer('author')->unsigned()->nullable();
	        $table->foreign('author')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
        });
	    DB::table('boxes')->insert([
		    "id" => 1,
		    "name" => "To chci",
		    "color" => "base-blue",
		    "basic" => true
	    ]);
	    DB::table('boxes')->insert([
		    "id" => 2,
		    "name" => "To mám",
		    "color" => "green",
		    "basic" => true
	    ]);
        Schema::table('likes', function(Blueprint $table){
	        $table->integer('box_id')->unsigned()->default(1);
	        $table->foreign('box_id')->references('id')->on('boxes')->onUpdate('cascade')->onDelete('cascade');
	        $table->dropColumn('owned');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
	    Schema::table('likes', function(Blueprint $table){
		    $table->dropColumn('box_id');
			$table->boolean('owned')->default(false);
	    });
        Schema::drop('boxes');
    }
}
