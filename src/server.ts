import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import isURL from 'validator/lib/isURL';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


  //! END @TODO1
 
  app.get( "/filteredimage/", async (req:express.Request, res:express.Response) => {
    const { image_url } = req.query;

    // Check if the user has input a url and if it is a valid one
    if (!image_url) {
      return res.status(400).send("Image URL is required");
    } else if (!isURL(image_url)) {
      return res.status(400).send("Invalid URL format, try another image url.");
    }

    try {
      // Filter the image
      const filteredpath = await filterImageFromURL(image_url);

      // Send the file to the User if successfully filtered
      res.status(200).sendFile(filteredpath, () => {

        // Delete Filtered Image file from the server
        deleteLocalFiles([filteredpath]);
      });
      return;
    } catch {
      // Send error if the image cannot be proccesed from the provide URL
      return res.status(422)
        .send("The provided Image URL could not be processed, Try diffrent image URL!");
    }
  }); //! END @TODO1


  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req:express.Request, res:express.Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();