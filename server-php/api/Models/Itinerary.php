<?php

namespace ItineraryApi\Models;

use Illuminate\Database\Eloquent\Model as Model;
use ItineraryApi\Utils\UnauthorizedException;

use function PHPSTORM_META\type;

class Itinerary extends Model
{
    protected $table = 'itineraries';

    protected $primaryKey = 'id';

    protected $hidden = ['user_id', 'created_at', 'updated_at'];

    public function activities()
    {
        return $this->hasMany(Activity::class, 'activity_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public static function getItineraries($userId)
    {
        return self::where('user_id', $userId)->get();
    }

    public static function getItinerary($id, $userId)
    {
        $itinerary = self::findOrFail($id);
        UnauthorizedException::checkId($itinerary->user_id, $userId);

        return $itinerary;
    }

    public static function createItinerary($userId)
    {
        $itinerary = new Itinerary();
        $itinerary->user_id = $userId;
        $itinerary->title = $_REQUEST['title'];
        $itinerary->start_date = $_REQUEST['start_date'];
        $itinerary->end_date = $_REQUEST['end_date'];
        $itinerary->save();

        return $itinerary;
    }

    public static function updateItinerary($id, $userId)
    {
        $itinerary = self::findOrFail($id);
        UnauthorizedException::checkId($itinerary->user_id, $userId);

        foreach ($_REQUEST as $field => $value) {
            $itinerary->$field = $value;
        }

        $itinerary->save();

        return $itinerary;
    }

    public static function deleteItinerary($id, $userId)
    {
        $itinerary = self::findOrFail($id);
        UnauthorizedException::checkId($itinerary->user_id, $userId);

        $itinerary->delete();
    }
}