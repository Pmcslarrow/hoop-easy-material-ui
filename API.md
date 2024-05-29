## HoopEasy API Reference
------------------------------------------------------------------------------------------

#### Listing existing db values
<details>
 <summary><code>GET</code> <code><b>/api/users</b></code> <code>(Retrieves all users and their info)</code></summary>

 ##### Example cURL

> ```javascript
>  curl -X GET -H "Content-Type: application/json" https://hoop-easy-production.up.railway.app/api/users
> ```

##### Parameters

> None

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`         | { "id": Number, "username": String, "email": String, "firstName": String, "middleInitial": String, "lastName": String, "gamesAccepted": Number, "gamesDenied": Number, "gamesPlayed": Number, "heightFt": Number, "heightInches": Number, "weight": Number, "overall": String, "profilePic": String }                                                         |
> | `500`         | `application/json`        | Internal server error                                                       |

</details>



<details>
 <summary><code>GET</code> <code><b>/api/games</b></code> <code>(Retrieves all games, including those that are available, in progress, and in the verification stage)</code></summary>

 ##### Example cURL

> ```javascript
>  curl -X GET -H "Content-Type: application/json" https://hoop-easy-production.up.railway.app/api/games
> ```

##### Parameters

> None

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`         | { "gameID": Number, "userID": Number, "address": String, "longitude": String "latitude": String, "dateOfGameInUTC": String, "distance": Number or null, "gameType": Number, "playerCreatedID": String, "timeOfGame": String, "userTimeZone": String, "status": String, "teammates": { "teammate0": String, "teammate1": String }, "captains": { "captain0": String, "captain1": String }, "scores": { "team1": String, "team2": String }, "team1": { "player0": String }, "team2": { "player0": String }, "teamOneApproval": Number, "teamTwoApproval": Number or null } |
> | `500`         | `application/json`        | Internal server error                                                       |

</details>





<details>
 <summary><code>GET</code> <code><b>/api/getUser</b></code> <code>(Retrieves a single user)</code></summary>

##### Parameters

> | Name   | Type   | Description                 |
> |--------|--------|-----------------------------|
> | email  | String | Required. The user's email. |

 ##### Example cURL

> ```javascript
>  curl -X GET -H "Content-Type: application/json" "https://hoop-easy-production.up.railway.app/api/getUser?email=EMAIL"
> ```

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`                | { "id": Number, "username": String, "email": String, "firstName": String, "middleInitial": String, "lastName": String, "gamesAccepted": Number, "gamesDenied": Number, "gamesPlayed": Number, "heightFt": Number, "heightInches": Number, "weight": Number, "overall": String, "profilePic": String }                                                                            |
> | `500`         | `application/json`                | Internal server error                                                       |

</details>







<details>
 <summary><code>GET</code> <code><b>/api/getUserWithID</b></code> <code>(Retrieves a single user)</code></summary>

##### Parameters

> | Name   | Type   | Description                 |
> |--------|--------|-----------------------------|
> | email  | String | Required. The user's email. |

 ##### Example cURL

> ```javascript
>  curl -X GET -H "Content-Type: application/json" "https://hoop-easy-production.up.railway.app/api/getUserWithID?userID=ID"
> ```

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`                | { "id": Number, "username": String, "email": String, "firstName": String, "middleInitial": String, "lastName": String, "gamesAccepted": Number, "gamesDenied": Number, "gamesPlayed": Number, "heightFt": Number, "heightInches": Number, "weight": Number, "overall": String, "profilePic": String }                                                                            |
> | `500`         | `application/json`                | Internal server error                                                       |

</details>

------------------------------------------------------------------------------------------