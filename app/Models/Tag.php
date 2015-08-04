<?php namespace ToChces\Models;

use Illuminate\Database\Eloquent\Model;
use Session;

class Tag extends Model {

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'tags';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['name'];

	protected $appends = ['is_active'];

	public function products(){
		return $this->belongsToMany('ToChces\Models\Product', 'tag_product');
	}

	public function getIsActiveAttribute(){
		$activeCategories = Session::get('categories', []);
		return $this->primary && in_array($this->id, $activeCategories);
	}

}
