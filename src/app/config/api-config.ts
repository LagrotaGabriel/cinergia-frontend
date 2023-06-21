import { isDevMode } from '@angular/core';
export const API_CONFIG = {
    baseUrl: isDevMode() ? 'http://localhost:9090/api/v1' : 'https://cinergia-backend.herokuapp.com/api/v1',
    devToken: isDevMode() 
    ? '	Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMjIxODgyNjQzNyIsImV4cCI6MTY4Nzk3NDk4NH0.hxN3QrUl-KVEDq-vHj1VNV5Msu0faK58-kvygs-e2wqyv6f6Q-meRHvDp9cVy_5ZKts_sj2VFNNQTUXd737JqQ'
    : 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMjM0NTY3ODkxMSIsImV4cCI6MTY4NzM1OTQ5MX0.mIeyRc7zJ49zBqjBjwLOhV6fSsiTBXIgnu9MWvJ5WrleIkOHqIKxMvydlq5aQGRrJNJcfFSV8xVq2G-EtyGiqQ'
}