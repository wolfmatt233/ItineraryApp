<?php

namespace ItineraryApi\Controllers;

use ItineraryApi\Models\Token;
use ItineraryApi\Models\User;
use ItineraryApi\Utils\InputValidator;

class UserController
{
    public $requiredFields = ['username', 'email', 'password'];

    public function index()
    {
        $res = User::getUsers();
        return ['status' => 200, 'data' => ['items' => $res]];
    }

    public function account($userId)
    {
        $res = User::getAccount($userId);
        return ['status' => 200, 'data' => $res];
    }

    public function view($id)
    {
        $res = User::getUser($id);
        return ['status' => 200, 'data' => $res];
    }

    public function create()
    {
        // TODO: Log in when user is created
        InputValidator::emptyInputs($this->requiredFields);
        $res = User::createUser();
        if ($res) {
            Token::createToken($res['id']);
        }
        return ['status' => 200, 'data' => $res];
    }

    public function update($id, $userId)
    {
        InputValidator::emptyInputs($this->requiredFields);

        $res = User::updateUser($id, $userId);
        return ['status' => 200, 'data' => $res];
    }

    public function delete($id, $userId)
    {
        User::deleteUser($id, $userId);
        return ['status' => 200, 'message' => 'User successfully deleted'];
    }
}