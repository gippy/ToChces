<?php namespace ToChces\Models;

use Illuminate\Database\Eloquent\Model;

class Like extends Model {

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'likes';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['user_id', 'product_id', 'owned', 'box_id'];

	/**
	 * Get the liked product.
	 */
	public function product()
	{
		return $this->belongsTo('ToChces\Models\Product');
	}

	/**
	 * Get the user that liked the product.
	 */
	public function user()
	{
		return $this->belongsTo('ToChces\Models\User');
	}

	/**
	 * Get the box of this like.
	 */
	public function box()
	{
		return $this->belongsTo('ToChces\Models\Box');
	}

	protected $appends = ['color'];

	public function getColorAttribute(){
		$box = $this->box;
		return $box != null ? $box->color : '';
	}
}
