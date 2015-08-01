<?php namespace ToChces\Models;

use Illuminate\Database\Eloquent\Model;

class Social extends Model {

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'socials';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['platform', 'platform_id'];

	public $timestamps = false;

	public function user() {
		return $this->belongsTo('ToChces\Models\User');
	}

}
