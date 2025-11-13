# How to get the API running
- Install python
- Install dependencies (requirements.txt)
- Run api.py either by:
- - Opening the file
- - Dragging the file onto command prompt
- - Typing `python "{filePath}"` into your command line
- Congrats

You can check whether it's working by going to 127.0.0.1:5089
You should see `{"code": 200}` (this is good)
If you would like to see the documentation, add `/docs` to the end of the url

All endpoints are crud (create, read, update, delete) and they include check/fetch for your convenience
# Data Structures
| Table | Column | Type | Required | Example | Note |
| - | - | - | - | - | - |
| clients | id | int | True | 2378 | 4 Random digits |
| clients | name | str | True | Fish & Ships | |
| clients | location | str | True | AB11 5NP| |
| clients | carbontype | int | True | 2 | Enum (1=Distillery, 2=Biogas (Food), 3=Biogas (Manure)) |
| clients | producer | bool| True | True | False = Consumer |
| routes | id | str| True | kodw-divr | 4 Random letters twice with a hyphen in between|
| routes | locations | str| True | 2378,1639,4502 | Client id's concatenated with commas |
| drivers | id | int| True | 1, 2, 3 | Incremental |
| drivers | name | str| True | John Doe | |
| drivers | position | str| True | Senior Driver | |
| trucks | id | int | True | 1, 2, 3 | Incremental |
| trucks | capacity | int | True | 120 | |
| trucks | long | float | True | 57.11896 | Longitude |
| trucks | lat | float | True | -2.13787 | Latitude |
| trucks | routeid | str | False | kodw-divr | Routes |
| trucks | driverid | str | False | 1, 2, 3 | Drivers |
# Status Codes
| Code | Meaning | Explanation | English Explanation |
| - | - | - | - |
| 200 | OK | | Expected outcome |
| 201 | Created | | You made something |
| 400 | Bad Request | Client error, server can/will not process request| Your fault, read error |
| 401 | Unauthorized | Unauthenticated, no credentials attached| Didn't include token |
| 403 | Forbidden | Authenticated, unpermitted| Included token, but don't have permission |
| 404 | Not Found | Server cannot find requested resource| You asked for something, we don't have it |

# Goodbye
If anything is broken, tell me pls, most errors that come through code 400 are your doing, but if you're certain it's the api or you just can't figure it out, message me and I'll be able to help
I don't have much else to add, I am very tired
Love you lots and good luck