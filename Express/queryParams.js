import express from "express";
import path from "path";

const app = express();

const PORT = process.env.PORT || 3000;

const dirName = import.meta.dirname;
const fileDir = path.join(dirName, "public");

app.use(express.static(fileDir));

app.get("/products", (req, res) => {
  // const {search} = req.query
  // console.log(req.query.search)
  // ?search=mobiles&search=phones
  // const serchArray = Array.isArray(search) ? search : [search]
  //   const { search } = req.query;
  //   res.send(`<h1>Query Parameters are ${search}</h1>`);


//   Object did not work with query like filter[role] = admin, filter[active] = true
  const { role, active } = req.query.filter || {};
  res.send({ role, active });
});

app.listen(PORT, () => {
  console.log(`Server is Running on PORT: ${PORT}`);
});
