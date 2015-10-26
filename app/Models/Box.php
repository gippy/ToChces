<?php namespace ToChces\Models;

use Illuminate\Database\Eloquent\Model;

class Box extends Model {

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'boxes';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['name', 'color', 'author', 'basic'];

	public $timestamps = false;

	/**
	 * Get author of the box.
	 */
	public function owner()
	{
		return $this->belongsTo('ToChces\Models\User', 'author', 'id');
	}

	/**
	 * Get likes with this box.
	 */
	public function likes()
	{
		return $this->hasMany('ToChces\Models\Like');
	}
}
