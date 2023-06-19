import { isDevMode } from '@angular/core';
export const API_CONFIG = {
    baseUrl: isDevMode() ? 'http://localhost:9090/api/v1' : 'https://cinergia-backend.herokuapp.com/api/v1',
    devToken: isDevMode() 
    ? 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMjIxODgyNjQzNyIsImV4cCI6MTY4NzgwOTE3Nn0.LR2dyxMpoODb5lvXZMz1xHwXMefHYQIj9xunrERZUdWMSWUha2X0RZhU0QHpzyBwadF-l03mBRprszk8MARBzg'
    : 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMjM0NTY3ODkxMSIsImV4cCI6MTY4NzM1OTQ5MX0.mIeyRc7zJ49zBqjBjwLOhV6fSsiTBXIgnu9MWvJ5WrleIkOHqIKxMvydlq5aQGRrJNJcfFSV8xVq2G-EtyGiqQ'
}