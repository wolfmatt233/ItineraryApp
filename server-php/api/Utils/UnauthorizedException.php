<?php

namespace ItineraryApi\Utils;

use Exception;
use ItineraryApi\Models\User;

class UnauthorizedException
{
    public static function checkId($id, $userId)
    {
        if ($id !== $userId) {
            throw new Exception('You do not have permission to access this resource', 403);
        }
    }

    public static function checkEmail($email, $userId)
    {
        $prevUser = User::getUserByEmail($email);

        if ($prevUser && $prevUser->id != $userId) {
            throw new Exception('Email already in use', 409);
        }
    }
}