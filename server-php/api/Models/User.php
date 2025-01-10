<?php

namespace Api\Models;

use Illuminate\Database\Eloquent\Model as Model;

class User extends Model
{
    protected $table = 'users';

    protected $primaryKey = 'id';

    protected $hidden = ['id', 'password', 'created_at', 'updated_at'];

    public function token()
    {
        return $this->hasOne(Token::class, 'id');
    }

    public static function getUserByUid($userId)
    {
        return self::where('id', $userId)->first();
    }

    public static function getUserByEmail($email)
    {
        return self::where('email', $email)->first();
    }

    public static function createUser($body)
    {
        $user = new User();
        $user->username = $body['username'];
        $user->email = $body['email'];
        $user->password = password_hash($body['password'], PASSWORD_DEFAULT);
        $user->save();

        return $user['id'];
    }

    public static function updatePassword($userId, $newPassword)
    {
        $user = self::getUserByUid($userId);
        $user->password = password_hash($newPassword, PASSWORD_DEFAULT);
        $user->save();
    }

    public static function deleteUser($userId)
    {
        $user = self::find($userId)->first();
        return $user->delete();
    }
}