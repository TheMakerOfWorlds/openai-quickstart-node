export default async function getPhotos(req, res) {
  // {
  //   "imageNames": ["dog","cat","rat"]
  // } passed

  var imageNames = req.body;
  imageNames = imageNames.imageNames;
  if (imageNames == null || imageNames == undefined || imageNames == "") {
    res.status(400).json({
      error: {
        message: "Please enter a valid request",
      },
    });
    return;
  }

  const requests = imageNames.map(async (searchTerm) => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?page=1&per_page=1&orientation=squarish&query=${searchTerm}&client_id=${process.env.UNSPLASH_API_KEY}`,
        {
          method: "GET",
        }
      );
      const json = await response.json();
      return json.results[0].urls.regular;
    } catch (error) {
      console.error(error);
      console.log(error);

      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "ERROR: " + error,
        }),
      };
    }
  });

  const imageUrls = await Promise.all(requests);
  res.status(200).json({ result: imageUrls });
  console.log(imageUrls); // this will print an array of image URLs, one for each item in req
}
