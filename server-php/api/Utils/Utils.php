<?php

namespace Api\Utils;

use Psr\Http\Message\ResponseInterface as Response;

class Utils
{
    public static function jsonResponse(Response $response, $data, $status = 200)
    {
        $response->getBody()->write(json_encode($data));
        return $response->withStatus($status)->withHeader('Content-Type', 'application/json');
    }

    public static function errorResponse(Response $response, $message, $status)
    {
        $status === 500 ? $message = 'Internal server error' : $message;
        return self::jsonResponse($response, ['error' => $message], $status);
    }

    public static function validateInputs(Response $response, $requiredFields, $body)
    {
        if (!is_array($body)) {
            return self::errorResponse($response, 'Invalid or missing input data', 400);
        }

        foreach ($requiredFields as $field) {
            if (!isset($body[$field]) || empty($body[$field])) {
                return self::errorResponse($response, 'Invalid or missing input data', 400);
            }
        }

        return true;
    }
}
