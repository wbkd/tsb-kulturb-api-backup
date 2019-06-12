# TSB KulturB API

Metadata generator API for TSB "Kultur B" project.

The API server can handle user management, file uploads and the creation, modification, list and deletion of organisations and tags.

## Requirements

- [AWS S3](http://aws.amazon.com/) Bucket for image upload
- [Here](https://developer.here.com/products/geocoding-and-search) API Key for geocoding
- Node.js (recommended >= v10) to run the application code
- MongoDB (recommended >= v4) to store persistent data

## Configuration

You can configure the API server either setting environment variables or defining the same variables in a local `.env` file stored in the root project folder. An example of `.env` file would look like the following:

```
REDIS_URL=localhost:6379
MONGODB_URI=mongodb://localhost:27017/data
PORT=8000

AWS_ACCESS_KEY_ID=AFIOIWTMSLDG4593ASK
AWS_SECRET_ACCESS_KEY=iqlaKF3902FFewerio59JEWe94Kwe352Koep93

ADMIN_EMAIL=test@webkid.io
ADMIN_PASSWORD=ASecurePasswordForThe1AdminUser!

HERE_APP_ID=oW4i5omfEWO3453SDf
HERE_APP_CODE=ok3259F8Fk923K53ko3Ko57
```

The `ADMIN_EMAIL` and `ADMIN_PASSWORD` field are used to create an admin if these are passed on start. Changing `ADMIN_PASSWORD` will change the password for the user in `ADMIN_EMAIL`.

## Installation

Clone this repository, enter the root folder and run the following:

```
nvm use # optional
npm install
```

## Usage

Start the server running:
```
npm start
```

## Import/Export

Data can be imported or exported using the import/export endpoints or the UI provided by the [tsb-kulturb-cms](https://github.com/wbkd/tsb-kulturb-cms) project.
