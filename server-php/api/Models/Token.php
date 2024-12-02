<?php

namespace ItineraryApi\Models;

use Illuminate\Database\Eloquent\Model as Model;

class Token extends Model
{
    protected $table = 'tokens';

    protected $primaryKey = 'id';

    protected $hidden = ['created_at', 'updated_at'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public static function getToken($id)
    {
        return self::where('user_id', $id)->first();
    }

    public static function createToken($id, $refreshToken = null)
    {
        $token = new Token();
        $token->user_id = $id;
        $token->refresh_token = password_hash($refreshToken, PASSWORD_DEFAULT);
        $token->save();

        return $token;
    }

    public static function verifyToken($refreshToken, $storedToken)
    {
        return password_verify($refreshToken, $storedToken);
    }

    public static function updateToken($id, $refreshToken)
    {
        $token = self::getToken($id);
        $token->refresh_token = password_hash($refreshToken, PASSWORD_DEFAULT);
        $token->save();

        return $token;
    }
}