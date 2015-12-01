<?php namespace ToChces\Http\Controllers;

use ToChces\Repositories\UserRepository;
use ToChces\Models\User;
use Illuminate\Support\Facades\Auth;
use Response;
use Request;
use Log;

class UsersController extends Controller {

	/** @var UserRepository Users repository **/
	protected $userRepository = null;

	/**
	 * Create a new controller instance.
	 * @param UserRepository $userRepository
	 */
	public function __construct(UserRepository $userRepository){
		$this->userRepository = $userRepository;
	}

	/**
	 * Show the application dashboard to the user.
	 *
	 * @return Response
	 */
	public function all() {
		return Response::json(array(
			"users" => $this->userRepository->all()
		));
	}

	public function single(User $user)
	{
		return view('users/single', array(
			'user' => $user
		));
	}

	public function current() {
		$user = Auth::user();
		return view('users/current', array(
			'user' => $user
		));
	}

	public function settings(){
		$user = Auth::user();
		return view('users/settings', array(
				'user' => $user
		));
	}

	public function settingsSubmit(){
		$file = Request::file('photo');
		if ($file && $file->isValid()) {
			$filename = $file->getRealPath();
			$image = $this->imageCreateFromAny($filename);
			if($image) {
				list($width, $height) = getimagesize($filename);

				$baseSize = min($width, $height);
				$left = ($width - $baseSize) / 2;
				$top = ($height - $baseSize) / 2;

				$size = 124;
				$newImage = imagecreatetruecolor($size, $size);

				imagecopyresampled($newImage, $image, 0, 0, $left, $top, $size, $size, $baseSize, $baseSize);

				ob_start();
				imagejpeg($newImage, null, 75);
				$image_data = ob_get_contents();
				ob_end_clean();

				imagedestroy($newImage);
				imagedestroy($image);
				unlink($filename);

				$user = Auth::user();
				$user->image = 'data: image/jpeg;base64,'.base64_encode ($image_data);
				$user->save();
			}
		}
		return redirect('/settings');
	}

	private function imageCreateFromAny($filepath)
	{
		$type = exif_imagetype($filepath);
		$allowedTypes = array(1, 2, 3, 6);
		if (!in_array($type, $allowedTypes)) {
			return false;
		}
		switch ($type) {
			case 1 :
				$im = imageCreateFromGif($filepath);
				break;
			case 2 :
				$im = imageCreateFromJpeg($filepath);
				break;
			case 3 :
				$im = imageCreateFromPng($filepath);
				break;
			case 6 :
				$im = imageCreateFromBmp($filepath);
				break;
		}
		return $im;
	}

}
