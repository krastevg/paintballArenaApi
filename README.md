
# PaintballAppApi

This is an API made for my Angular project Paintball Arena

I use mongo atlas in order to store the data

In order to use it you will need a username and password for mongo atlas.
send me an email at georgikrustev235@abv.bg if you wish to get acces Otherwise just replace the url which is located in the index.js fail in the root folder . The server does not need preloaded data to function.

## How to get it up and running

Clone the repository and run npm install ;
change dbConnection api string ;
Start the server with npm start ;



## ENDPOINTS

### GET:

/months - returns every month in the database with populated days

/months?month=<yourData>&year=<yourData> AUTH:required returns an array with 1 element in it a month object with day objects populated in it
if the month has not been used in the db yet it is created along with the days    

month must be one of the following example /months?month=January&year=2020
"January",
"February",
"March",
"April",
"May",
"June",
"July",
"August",
"September",
"October",
"November",
"December",

/day?dayId=<dayId>  AUTH:required; returns a single day from the db does not work without query params !
  
/reservation/getByUser/:userId AUTH:required; returns an array of reservations (with the day:IDay[] field  populated ) which the user with the userId param has made


/user/checkAuth AUTH:NO returns a message if the provided jwt via cookie is valid

/user/profile?userId=<userId> AUTH:required;  returns an array of reservations which the user with the  userId passed via query param has made NEEDS QUERY PARAM
  


### POST:

/user/register  
body: {username,password,rePassword}
response 201: userObject and sets a cookie with jwt
desc: if the insertion in the DB is succsessfull a jwt token is created and stored in cookies, the user object is returned

/user/login
body: {username,password}
response 200: userObject and sets a cookie with jwt
desc: if a user is found in the DB a jwt token is created and stored in the cookies , the user object is returned

/reservation/makeReservation?dayId=$<dayid>&userId=$<userid>&price=$<price>
AUTH: required
QUERY PARAMS ARE NEEDED
body{ hours, people }
response 201 : Reservation Object
desc: creates reservation with the provided params and returns the object


### DELETE:
/reservation/delete/:id  AUTH: required
deletes the reservaton with the provided ID

### PATCH

/day/:dayId?type=<update || delete >&frame=<firstFrame || secondFrame || thirdFrame>
AUTH: required
body { reservId }
response: 200 dayObj
desc: MUST PRVOIDE QUERY PARAMS
#### type = update
Adds a reservation id in one of the fields (firstFrame secondFrame thirdFrame) of the day object which id is provided

#### type = delete
Deletes a reservation id from one of the fields (firstFrame secondFrame thirdFrame) of the day object which id is provided



