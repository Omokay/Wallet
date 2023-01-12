# Demo_Credit
  Demo Credit is a mobile lending app that requires wallet functionality. This is needed as borrowers need a wallet to receive the loans they have been granted and also send the money for repayments.
## Features
   + A user can create an account
   + A user can fund their account
   + A user can transfer funds to another user’s account
   + A user can withdraw funds from their account.
## Development
   Quick Credit is built using the following technologies
   + Nodejs
   + NodeJS (LTS version)
   + KnexJS ORM
   + MySQL database
   + Typescript
## Installation
   1. Make sure you have a stable version of node installed
   2. Clone this repository [https://github.com/Omokay/Wallet.git](https://github.com/Omokay/Wallet.git)
   3. Go to the project directory `cd Wallet`
   4. Add a .env file to the root directory
   5. Provide values for environment variables `MYSQL_DATABASE` for the database name and `MYSQL_PASSWORD` for the database password.
   6. To startup the application run `docker compose up`
## Working API Routes
  | Action        | Request Type           | Endpoint  |
  | ------------- |:-------------:| -----:|
  |   User signup   |   POST    |  /api/v1/users/register  |
  |   User signin   |  POST     | /api/v1/users/login   |
  |   Create account  |  POST     | /api/v1/wallets/   |
  |   Fund acccount  | POST      | /api/v1/wallets/fund  |
  |   Withdraw funds  |  POST     | /api/v1/wallets/withdraw   |
  |   Transfer  |  POST     | /api/v1/wallets/transfer   |

## Links
## Api Collection
   Postman: [Link](https://api.postman.com/collections/7398319-2f685a8d-0897-4eff-a439-a9bfd0342b89?access_key=PMAT-01GPJKRN3W4CHQFZVDDY82YBCH)
## Licensing 
   Demo Credit is under the MIT License
## Author
   Chuku Omoke David
