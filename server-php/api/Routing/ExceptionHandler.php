<?php

namespace ItineraryApi\Routing;

use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

use function PHPSTORM_META\type;

class ExceptionHandler
{
    public function handleException(Exception $e)
    {
        if ($e instanceof Exception) {
            $code = gettype($e->getCode()) === "integer" ? $e->getCode() : 500;
            http_response_code($code);
            return ['status' => $e->getCode(), 'data' => ['message' => $e->getMessage()]];
        }

        // Default if no exception is found
        http_response_code(500);
        return [
            'status' => 500,
            'data' => [
                'message' => 'Internal Server Error',
            ]
        ];
    }
}