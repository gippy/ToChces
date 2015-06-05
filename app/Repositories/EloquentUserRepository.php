<?php namespace ToChces\Repositories;

use ToChces\Models\User;
 
class EloquentUserRepository implements UserRepository {
   
  public function all(){
    return User::orderBy('created_at', 'desc')->get();
  }
 
  public function find(int $id){
    return User::find($id);
  }
 
  public function create(array $input){
    $user = User::create($input);
    if ($input['password']) $user->setPassword($input['password']);
    $user->save();

    return $user;
  }

  public function update(int $id, array $input){
    $user = User::findOrFail($id);
    $user->update($input);
    return $user;
  }

  public function getLikes(int $id){
    
  }
  
  public function destroy(int $id){
    User::destroy($id);
  }
 
}