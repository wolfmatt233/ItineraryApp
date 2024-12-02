<?php

namespace ItineraryApi\Utils;

class InputValidator
{
    public static function emptyInputs($requiredFields)
    {
        foreach ($requiredFields as $field) {
            if (empty($_REQUEST[$field]) && $field != 'notes') {
                throw new \InvalidArgumentException("Missing required field: $field");
            }
        }
    }
}