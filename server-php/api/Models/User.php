<?php

namespace ItineraryApi\Models;

use Illuminate\Database\Eloquent\Model as Model;
use ItineraryApi\Utils\UnauthorizedException;

class User extends Model
{
    protected $table = 'users';

    protected $primaryKey = 'id';

    protected $hidden = ['password', 'created_at', 'updated_at'];

    public function itineraries()
    {
        return $this->hasMany(Itinerary::class, 'itinerary_id');
    }

    public function token()
    {
        return $this->belongsTo(Token::class, 'id');
    }

    public static function getUsers()
    {
        return self::all();
    }

    public static function getAccount($userId)
    {
        return self::findOrFail($userId);
    }

    public static function getUser($id)
    {
        return self::findOrFail($id);
    }

    public static function getUserByEmail($email)
    {
        return self::where('email', $email)->first();
    }

    public static function createUser()
    {
        UnauthorizedException::checkEmail($_REQUEST['email'], null);

        $user = new User();
        $user->username = $_REQUEST['username'];
        $user->email = $_REQUEST['email'];
        $user->password = password_hash($_REQUEST['password'], PASSWORD_DEFAULT);
        $user->save();

        return $user;
    }

    public static function updateUser($id, $userId)
    {
        $user = self::findOrFail($id);
        UnauthorizedException::checkId($user->id, $userId);
        UnauthorizedException::checkEmail($_REQUEST['email'], $userId);

        foreach ($_REQUEST as $field => $value) {
            if ($field === 'password') {
                $user->password = password_hash($_REQUEST['password'], PASSWORD_DEFAULT);
            } else {
                $user->$field = $value;
            }
        }

        $user->save();
        return $user;
    }

    public static function deleteUser($id, $userId)
    {
        $user = self::findOrFail($id);
        UnauthorizedException::checkId($user->id, $userId);

        return $user->delete();
    }
}