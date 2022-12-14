import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import {filter} from "bluebird";

var path = require('path');
const url = require('url');


(async () => {

    // Init the Express application
    const app = express();

    // Set the network port
    const port = process.env.PORT || 8082;

    // Use the body parser middleware for post requests
    app.use(bodyParser.json());

    app.use("/public", express.static(path.join(__dirname, 'public')));

    // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
    // GET /filteredimage?image_url={{URL}}
    // endpoint to filter an image from a public url.
    // IT SHOULD
    //    1
    //    1. validate the image_url query
    //    2. call filterImageFromURL(image_url) to filter the image
    //    3. send the resulting file in the response
    //    4. deletes any files on the server on finish of the response
    // QUERY PARAMATERS
    //    image_url: URL of a publicly accessible image
    // RETURNS
    //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

    //! END @TODO1

    app.get("/filteredimage", async (req, res) => {

        try {
            const url = req.query.image_url;
            const check_valid_url = validate_url(url);

            if (check_valid_url) {
                const filteredPath = await filterImageFromURL(url);

                res.sendFile(filteredPath);

                res.on('finish', async function () {
                    // do stuff here
                    const filesArray = [];
                    filesArray.push(filteredPath);
                    await deleteLocalFiles(filesArray);
                });
            } else {
                res.status(400).send(`The url is not valid`);
            }
        }catch(error){
            res.status(400).send(`The following error has occurred ${error}`);
        }


    });

    function validate_url(url: string) {

        try {
            new URL(url);
            return true;
        } catch (error) {

            return false;
        }
    }


    // Root Endpoint
    // Displays a simple message to the user
    app.get("/", async (req, res) => {
        res.send("try GET /filteredimage?image_url={{}}")
    });


    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
})();