
# Bops of 2010

---

Name: Angela Pan

Date: 3/22/19

Project Topic: Bops of 2010

URL: http://103.283.293.13:2010/ ??

---


### 1. Data Format and Storage

Data point fields:
- `Field 1`: Title            `Type: String`
- `Field 2`: Artists           `Type: [String]`
- `Field 3`: Chart            `Type: Number`
- `Field 4`: Video            `Type: String`
- `Field 5`: Explicit         `Type: Boolean`

Schema:
```javascript
{
  title: String,
  artists: [String],
  chart: Number,
  video: String,
  explicit: Boolean
}
```

### 2. Add New Data

HTML form route: `/addBop`

POST endpoint route: `/api/addBop`

Example Node.js POST request to endpoint:
```javascript
var request = require("request");

var options = {
    method: 'POST',
    url: 'http://localhost:2010/api/addBop',
    headers: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
      title: "Baby",
      artists: ["Justin Bieber", "Ludacris"],
      chart: 1,
      video: "https://www.youtube.com/watch?v=kffacxfA7G4",
      explicit: false
    }
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data

GET endpoint route: `/api/bops`

### 4. Search Data

Search Field: `title`

### 5. Navigation Pages

Navigation Filters
1. Number 1 Hits -> `/topBops`
2. Wholesome Bops -> `/nonexplicit`
3. Collaborations -> `/collabs`
4. JB Bops -> `/jb`
5. Sort by Artist -> `/artist`
