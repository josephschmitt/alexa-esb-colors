# Alexa Empire State Building Colors Skill

This is a skill built for Amazon's Alexa service that queries the Empire State Building's [Tower
Lights Calendar](https://www.esbnyc.com/explore/tower-lights/calendar). It allows you to ask Alexa
the following:

>Alexa, ask the Empire State Building what the colors are.

>Alexa, ask the Empire State Building what the colors were yesterday.

>Alexa, ask the Empire State Building what the colors will be 3 days from now.

Alexa will respond with the description for the lights from the Tower Lights schedule for the given
day. This is also used as a sample project for those learning how to write Alexa apps using nodejs,
Amazon's Lambda service, and the Alexa Skills Kit.

## Testing The Skill Locally

You can use [node-lambda](https://github.com/motdotla/node-lambda) to test this skill locally. In
the `test_events` directory are several event files you can use for testing, and they should map
pretty well to each Intent. To test an intent, simply copy the contents of one of the json files in
that directory and overwrite the contents of `event.json`. Then run `node-lambda run` from the
command line.

## Deploying to Lambda

To deploy to Amazon Lambda, first makes sure you do an `npm install` at the root of the project.
Once all the dependencies are installed, run `npm run bundle`, which will create a lambda.zip file.
You can then upload that zip file to Lambda for use in your function and skill.

The deploy script bundles up all the necessary files and uploads them to lambda. Since the
`node_modules` directory needs to be uploaded instead of initialized after it's on the server, a
linux copy of one of the packages is manually added during the bundling process (which is what
`node-expat-linux-build/` contains). This will ensure you can deploy from any platform you're
developing for.

You can also use [node-lambda](https://github.com/motdotla/node-lambda) to deploy to your Lambda
function directly from the command line. Simply add a deploy.env file with your environment
configuration (and double check the supplied .env file in this repository) and then run
`node-lambda deploy`. Please visit the node-lambda project page for more information on deploying
from the command line.
