import { isDevMode } from '@angular/core';
export const API_CONFIG = {
    baseUrl: isDevMode() ? 'http://localhost:9090/api/v1' : 'https://cinergia-backend.herokuapp.com/api/v1',
    devToken: isDevMode() 
    ? 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMjM0NTY3ODkxMSIsImV4cCI6MTY4NzM1ODExMH0.lVYDtr_AjT11Ktt2O_pDVX32VsBLP5Co94uHKy82mIZ-QzjAQY8uZKC_PJhBEBO-LEd3umUdorTf5nw8Ec8G8Q'
    : 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMjM0NTY3ODkxMSIsImV4cCI6MTY4NzM1OTQ5MX0.mIeyRc7zJ49zBqjBjwLOhV6fSsiTBXIgnu9MWvJ5WrleIkOHqIKxMvydlq5aQGRrJNJcfFSV8xVq2G-EtyGiqQ'
}