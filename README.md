# color-palette-be


## Color Palette API

Sprint Board: https://github.com/BrandyMello/color-palette-be/projects/1

### Table of Contents
1. [Schema](#schema)
1. [Setup](#setup)
1. [API Endpoints](#endpoints)
  * [GET](#get)
  * [POST](#post)
  * [DELETE](#delete)

#### <a name="schema">Schema</a>
<img width="668" alt="Screen Shot 2019-10-08 at 6 49 46 PM" src="https://user-images.githubusercontent.com/46384968/66443517-a9202f80-e9fc-11e9-820f-09a83ec4b986.png">

#### <a name="setup">Setup</a>
To see the database, go to: 
https://color-palette-be.herokuapp.com/
 
 ### <a name="endpoints">API Endpoints</a>
 #### <a name="get">GET Requests</a>
 To GET all Projects:
 ```GET /api/v1/projects```<br>
 Return:
 ```[
{
id: 1,
name: "Warm Colors",
created_at: "2019-10-13T20:33:38.759Z",
updated_at: "2019-10-13T20:33:38.759Z"
},
{
id: 2,
name: "Cool Colors",
created_at: "2019-10-13T20:33:38.770Z",
updated_at: "2019-10-13T20:33:38.770Z"
},
{
id: 3,
name: "Neutral Colors",
created_at: "2019-10-13T20:33:38.777Z",
updated_at: "2019-10-13T20:33:38.777Z"
}
]
```
To GET all Palettes:
```GET /api/v1/palettes```<br>
Returns:
```[
{
id: 1,
name: "Autumn",
projectName: "Warm Colors",
colorOne: "#BC8F8F",
colorTwo: "#A52A2A",
colorThree: "#FF7D40",
colorFour: "#CD3700",
colorFive: "#993300",
projectId: 1,
created_at: "2019-10-13T20:33:38.782Z",
updated_at: "2019-10-13T20:33:38.782Z"
},
{
id: 2,
name: "Canyon",
projectName: "Warm Colors",
colorOne: "#6E352C",
colorTwo: "#CF5230",
colorThree: "#F59A44",
colorFour: "#E3C598",
colorFive: "#8A6E64",
projectId: 1,
created_at: "2019-10-13T20:33:38.783Z",
updated_at: "2019-10-13T20:33:38.783Z"
},
{
id: 3,
name: "Spiced",
projectName: "Warm Colors",
colorOne: "#F7E5D4",
colorTwo: "#FADDAF",
colorThree: "#EB712F",
colorFour: "#91371B",
colorFive: "#472C25",
projectId: 1,
created_at: "2019-10-13T20:33:38.790Z",
updated_at: "2019-10-13T20:33:38.790Z"
},...
]
```
To GET a Project by id:
```GET /api/v1/projects/:id```<br>
example: ```/api/v1/projects/3```<br>
Returns:
```[
{
id: 3,
name: "Neutral Colors",
created_at: "2019-10-13T20:33:38.777Z",
updated_at: "2019-10-13T20:33:38.777Z"
}
]
```
To GET a Palette by id:
```GET /api/v1/palettes/:id```<br>
example: ```/api/v1/palettes/9```<br>
Returns: 
```[
{
id: 9,
name: "Stone",
projectName: "Neutral Colors",
colorOne: "#D2D4DC",
colorTwo: "#AFAFAF",
colorThree: "#F8F8FA",
colorFour: "#E5E6EB",
colorFive: "#C0C2CE",
projectId: 3,
created_at: "2019-10-13T20:33:38.811Z",
updated_at: "2019-10-13T20:33:38.811Z"
}
]
```
#### <a name="post">POST Requests</a>
To POST a country:<br>
```POST /api/v1/projects```<br>
Request Body:<br>
```
{
	"name": "Test Project"
}
```
Returns: <br>
```
{
    "id": 4
}
```
To POST a palette:<br>
```POST /api/v1/palettes```<br>
Request Body:<br>
```
{
	id: 10,
  name: "Test Palette",
  projectName: "Test Project",
  colorOne: "#D2D4DC",
  colorTwo: "#AFAFAF",
  colorThree: "#F8F8FA",
  colorFour: "#E5E6EB",
  colorFive: "#C0C2CE"
}
```
Returns: <br>
```
{
    "id": 10
}
```
#### <a name="delete">DELETE Requests</a>
To DELETE a country: <br>
```
DELETE /api/v1/projects/:id
```
example: ```DELETE /api/v1/projects/4```

Returns: <br>
```
"This project has been deleted."
```


