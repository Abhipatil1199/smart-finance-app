import "dotenv/config";

import app from "./app";

const port = process.env.PORT ?? 5000;

app.listen(5000, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
