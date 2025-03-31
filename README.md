# Itenerary MERN Full Stack App

Author: [Matthew Wolf](https://www.linkedin.com/in/matthew-wolf2)

[YouTube Demo](https://youtu.be/A3E1h_2jICQ)

## Description

An itenerary website that allows you to create an travel itenerary on a day by day basis. Location and times can be laid out. A map can be used to select locations.

## Tech Stack (Express api)

- Database: MongoDB
- Server Framework: ExpressJS
- Server: Node

## Tech Stack (PHP api)

- Database: MySQL using Eloquent ORM
- Server Framework: Slim
- Server: Apache via XAMPP

## Other Tech & Libraries

- Frontend: React (via Vite)
- Leaflet Maps API
- React Big Calendar

## Database

- Users Collection

  - \_id (ObjectId)
  - username (string)
  - password (hashed string)
  - email (string)
  - createdAt (string)
  - updatedAt (string)

- Itineraries Collection

  - \_id (ObjectId)
  - userId (ObjectId)
  - title (string)
  - startDate (string)
  - endDate (string)
  - activities (array of objects)
  - createdAt (string)
  - updatedAt (string)

- Activities Collection

  - \_id (ObjectId)
  - userId (ObjectId)
  - itineraryId (ObjectId)
  - date (string)
  - time (string)
  - activity (string)
  - locationName (string)
  - locationLat (decimal)
  - locationLng (decimal)
  - notes (string)
  - completed (bool)
  - createdAt (string)
  - updatedAt (string)

## To Do

- [ ] Error message handling (popups, modals, etc.)
- [ ] Incorrect/empty input handling

## PHP Api

I added a PHP version of the api for my own practice that works the same, just using MySQL and a custom PHP router. I originally created the front end to work with MongoDB so, there are some features within the front end to help data from the PHP api work with the client. Primarily I added an identifier, \_id, to JSON objects that come from the PHP api.
