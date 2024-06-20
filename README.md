## Usage/Installation

To use this project, follow these steps:

1. Clone the repository: `git clone git@github.com:onurio/tl-amiloz-test.git`

2. Run `bash generate-auth-secret.sh` - generates a secret for the JWT authentication.

3. Build and run the container `docker-compose up --build`

4. Check the OpenAPI docs `http://localhost:3000/api-docs` - (You can also test the endpoints directly from here)

5. Import the `beloz.postman_collection.json` file into Postman for testing.
