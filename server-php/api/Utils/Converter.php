<?php

namespace Api\Utils;

class Converter
{
    public static function convertArrayofObjects($array)
    {
        $array = $array->toArray();
        $convertedArray = [];

        foreach ($array as $key => $value) {
            $convertedArray[] = self::convertKeysToCamelCase($value);
        }

        return $convertedArray;
    }

    public static function convertObject($object)
    {
        $attributes = array_diff_key(
            $object->getAttributes(),
            array_flip($object->getHidden())
        );

        return self::convertKeysToCamelCase($attributes);
    }

    public static function convertKeysToCamelCase($array)
    {
        $convertedArray = [];
        foreach ($array as $key => $value) {
            // Convert each key to camelCase and add it to the new array
            $convertedArray[self::snakeToCamel($key)] = $value;
        }

        return self::convertTimeKeys($convertedArray);
    }

    public static function snakeToCamel($string)
    {
        return lcfirst(
            str_replace(
                ' ',
                '',
                ucwords(
                    str_replace('_', ' ', $string)
                )
            )
        );
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

    // camel to snake
    public static function convertKeysToSnakeCase($array)
    {
        $convertedArray = [];
        foreach ($array as $key => $value) {
            // Convert the key to snake_case
            $snakeKey = self::camelToSnake($key);
            $convertedArray[$snakeKey] = $value;
        }

        return $convertedArray;
    }

    public static function camelToSnake($string)
    {
        return strtolower(preg_replace('/[A-Z]/', '_$0', $string));
    }
}