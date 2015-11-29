<?php namespace ToChces\Models;

use Illuminate\Database\Eloquent\Model;
use Auth;

class Product extends Model {

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'products';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['url', 'name', 'vendor', 'description', 'price', 'image', 'added_by', 'approved', 'layout'];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = ['liked', 'owned', 'color'];

	protected $like = false;
	protected $box = false;

	public function likes()
	{
		return $this->hasMany('ToChces\Models\Like');
	}

	public function like(){
		if ($this->like === false && Auth::check()) {
			$this->like = $this->likes()->where('user_id', Auth::user()->id)->first();
		}
		return $this->like;
	}

	public function creator() {
		return $this->belongsTo('ToChces\Models\User', 'added_by');
	}

	public function getLikedAttribute(){
		return $this->like() != null;
	}

	public function getOwnedAttribute(){
		$box = $this->box;
		return $box && $box->id == 2;
	}

	public function getColorAttribute(){
		return $this->box() != null ? $this->box()->color : '';
	}

	public function tags(){
		return $this->belongsToMany('ToChces\Models\Tag', 'tag_product');
	}

	public function box(){
		$like = $this->like();
		return $like ? $like->box : null;
	}
	

}
