<?php

namespace Api\Models;

use Illuminate\Database\Eloquent\Model as Model;

class Token extends Model
{
    protected $table = 'tokens';

    protected $primaryKey = 'id';

    public function token()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public static function getTokenByUid($userId)
    {
        return self::where('user_id', $userId)->first();
    }

    public static function createToken($id)
    {
        $token = new Token();
        $token->user_id = $id;
        $token->refresh_token = "";
        $token->save();

        return $token['id'];
    }

    public static function updateToken($userId, $refreshToken)
    {
        $token = self::getTokenByUid($userId);
        $token->refresh_token = password_hash($refreshToken, PASSWORD_DEFAULT);
        $token->save();

        return $token;
    }
}