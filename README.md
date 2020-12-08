This is an API made for my angular project for a course in SoftUni

I use mongo atlas in order to store the data

In order to use it you will need a username and password for mongo atlas.
send me an email at georgikrustev235@abv.bg if you wish to get acces Otherwise just replace the url which is located in the index.js fail in the root folder . The server does not need preloaded data to function.

ENDPOINTS

GET:

/months - returns every month in the database with populated days

/months?month={{yourData}}&year={{yourData}} returns an array with 1 element in it a month object with day objects populated in it
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

POST:

/user/register  
body: {username,password,rePassword}
response: userObject and sets a cookie with jwt
desc: if the insertion in the DB is succsessfull a jwt token is created and stored in cookies, the user object is returned

/user/login
body: {username,password}
response: userObject and sets a cookie with jwt
desc: if a user is found in the DB a jwt token is created and stored in the cookies , the user object is returned

DELETE:
