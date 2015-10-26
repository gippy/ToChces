<?php namespace ToChces\Repositories;

use ToChces\Models\Box;
use ToChces\Models\Like;

class EloquentBoxRepository implements BoxRepository
{

	public function all(){
		return Box::all();
	}

	public function owned($userId){
		return Box::where('author', $userId)->orWhere(function ($query){
			$query->whereNull('author');
		})->get();
	}

	public function merge($userId, $boxAId, $boxBId){
		Like::where('user_id', $userId)->where('box_id', $boxBId)->update(['box_id' => $boxAId]);
		if ($boxBId != 1 && $boxBId != 2) Box::destroy($boxBId);
	}

	public function remove($boxId) {
		if ($boxId == 1 || $boxId == 2){
			throw(new \Exception("Cannot delete basic category"));
		} else {
			/** @var Box $box */
			$box = Box::find($boxId);
			$this->removeContents($box->author, $box->id);
			$box->delete();
		}
	}

	public function removeContents($userId, $boxId){
		if ($boxId == 1) {
			Like::where('user_id', $userId)->where('box_id', $boxId)->delete();
		} else {
			Like::where('user_id', $userId)->where('box_id', $boxId)->update(['box_id' => 1]);
		}
	}

	public function create($userId, array $params) {
		$params['author'] = $userId;
		$params['basic'] = false;

		return Box::create($params);
	}

	public function update($userId, $boxId, array $params) {
		/** @var Box $box */
		$box = Box::findOrFail($boxId);
		if ($box->basic) throw(new \Exception("Cannot update basic category"));

		$params['author'] = $userId;
		$params['basic'] = false;

		$box->update($params);
		return $box;
	}

}