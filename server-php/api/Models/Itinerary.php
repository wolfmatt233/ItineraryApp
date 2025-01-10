<?php

namespace Api\Models;

use Illuminate\Database\Eloquent\Model as Model;

class Itinerary extends Model
{
    protected $table = 'itineraries';

    protected $primaryKey = 'id';

    protected $hidden = ['user_id', 'created_at', 'updated_at'];

    public function user()
    {
        return $this->belongsTo(User::class, 'id');
    }

    public function activities()
    {
        return $this->hasMany(Activity::class, 'activity_id');
    }

    public static function getItineraries($userId)
    {
        return self::where('user_id', $userId)->get();
    }

    public static function getItineraryById($id, $userId)
    {
        return self::where('id', $id)->where('user_id', $userId)->first();
    }

    public static function createItinerary($userId, $body)
    {
        $itinerary = new Itinerary();
        $itinerary->user_id = $userId;
        $itinerary->title = $body['title'];
        $itinerary->start_date = $body['start_date'];
        $itinerary->end_date = $body['end_date'];
        $itinerary->save();

        return $itinerary;
    }

    public static function updateItinerary($id, $userId, $body)
    {
        $itinerary = self::getItineraryById($id, $userId);

        if (!$itinerary) {
            return false;
        }

        foreach ($body as $field => $value) {
            $itinerary->$field = $value;
        }

        $itinerary->save();

        return $itinerary;
    }

    public static function deleteItinerary($id, $userId)
    {
        $itinerary = self::getItineraryById($id, $userId);

        if (!$itinerary) {
            return false;
        }

        $itinerary->delete();
        return true;
    }
}