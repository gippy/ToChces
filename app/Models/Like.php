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

	protected $primaryKey = ['user_id', 'product_id'];

	/**
	 * Set the keys for a save update query.
	 * This is a fix for tables with composite keys
	 * TODO: Investigate this later on
	 *
	 * @param  \Illuminate\Database\Eloquent\Builder  $query
	 * @return \Illuminate\Database\Eloquent\Builder
	 */
	protected function setKeysForSaveQuery(\Illuminate\Database\Eloquent\Builder $query) {
		if (is_array($this->primaryKey)) {
			foreach ($this->primaryKey as $pk) {
				$query->where($pk, '=', $this->original[$pk]);
			}
			return $query;
		}else{
			return parent::setKeysForSaveQuery($query);
		}
	}
}
