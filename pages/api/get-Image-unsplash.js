async function getPhotos(req, res) {
  try {
    const options = {
      method: "GET",
      url: `https://api.unsplash.com/search/photos?page=1&query=${req}`,
    };

    request(options, (error, response, body) => {
      if (error) throw new Error(error);

      res.send(body);
    });
  } catch (error) {
    res
      .status(500)
      .send({
        error: "An error occurred while trying to retrieve the photos.",
      });
  }
}
