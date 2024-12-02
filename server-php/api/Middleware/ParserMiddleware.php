<?php

namespace ItineraryApi\Middleware;

class ParserMiddleware
{
    public function handleParse()
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

        // Parse JSON data
        if (in_array($method, ['POST', 'PUT', 'PATCH']) && strpos($contentType, 'application/json') !== false) {
            $jsonData = file_get_contents("php://input");
            $json = json_decode($jsonData, true);

            // Merge parsed JSON data into $_REQUEST if no JSON error occurred
            if (json_last_error() === JSON_ERROR_NONE) {
                $json = $this->convertKeysToSnakeCase($json);
                $_REQUEST = array_merge($_REQUEST, $json);
            }
        }

        // Parse PATCH data for forms
        if ($method === 'PATCH' && strpos($contentType, 'multipart/form-data') !== false) {
            $rawData = file_get_contents('php://input');
            $boundary = substr($rawData, 0, strpos($rawData, "\r\n"));
            $parts = array_slice(explode($boundary, $rawData), 1);

            $data = [];
            foreach ($parts as $part) {
                if (strpos($part, 'Content-Disposition:') !== false) {
                    preg_match('/name="([^"]+)"/', $part, $matches);
                    $name = $matches[1] ?? null;

                    $content = trim(substr($part, strpos($part, "\r\n\r\n") + 4));
                    if (!empty($name)) {
                        $data[$name] = $content;
                    }
                }
            }

            // Merge parsed form data into $_REQUEST
            $_REQUEST = array_merge($_REQUEST, $data);
        }

        return true;
    }

    function camelToSnake($str)
    {
        // Convert camelCase to snake_case
        $str = preg_replace('/([a-z])([A-Z])/', '$1_$2', $str);
        return strtolower($str);
    }

    // Utility function to recursively convert an array's keys from camelCase to snake_case
    private function convertKeysToSnakeCase($array)
    {
        $convertedArray = [];
        foreach ($array as $key => $value) {
            $newKey = $this->camelToSnake($key); // Convert the key to snake_case
            // If the value is an array, recursively convert its keys
            if (is_array($value)) {
                $value = $this->convertKeysToSnakeCase($value);
            }
            $convertedArray[$newKey] = $value;
        }
        return $convertedArray;
    }
}