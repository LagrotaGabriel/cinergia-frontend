import { isDevMode } from '@angular/core';
export const API_CONFIG = {
    baseUrl: isDevMode() ? 'http://localhost:9090/api/v1' : 'https://cinergia-backend.herokuapp.com/api/v1',
    devToken: isDevMode() 
    ? '	Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMjIxODgyNjQzNyIsImV4cCI6MTY4ODA2MzE4N30.b9J5CLWTHU2BeZMs7FqeJLNQowgvKWJ-dZQDaK3-G3g0v0k8f1H4oSzlUwUOcPj_k4qFP9zJGfsvGwO7opQmcg'
    : 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMjM0NTY3ODkxMSIsImV4cCI6MTY4NzM1OTQ5MX0.mIeyRc7zJ49zBqjBjwLOhV6fSsiTBXIgnu9MWvJ5WrleIkOHqIKxMvydlq5aQGRrJNJcfFSV8xVq2G-EtyGiqQ'
}