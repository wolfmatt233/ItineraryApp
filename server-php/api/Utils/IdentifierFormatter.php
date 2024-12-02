<?php

namespace ItineraryApi\Utils;

class IdentifierFormatter
{
    public static function snakeToCamel($string)
    {
        return lcfirst(str_replace(' ', '', ucwords(str_replace('_', ' ', $string))));
    }

    public static function convertArrayKeysToCamelCase($array)
    {
        $convertedArray = [];
        foreach ($array as $key => $value) {
            // Convert each key to camelCase and add it to the new array
            $convertedArray[self::snakeToCamel($key)] = $value;
        }
        unset($convertedArray['createdAt'], $convertedArray['updatedAt']);

        return self::convertTimeKeys($convertedArray);
    }

    public static function convertTimeKeys($array)
    {
        $convertedArray = $array;
        foreach ($array as $key => $value) {
            if ($key === "date") {
                $newValue = str_replace(" ", "T", $value);
                $convertedArray[$key] = $newValue;
            }
        }

        return $convertedArray;
    }
}