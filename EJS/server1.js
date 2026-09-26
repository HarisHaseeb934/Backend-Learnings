import express from "express";
const PORT = process.env.PORT || 3000;
const app = express();

const products = [
  { name: "Laptop", category: "tech", inStock: true },
  { name: "Mouse", category: "tech", inStock: false },
  { name: "Desk Chair", category: "furniture", inStock: true },
];

app.set("view engine", "ejs")

app.get("/products", (req, res) => {
  const category = req.query.category;

  if (category !== undefined) {
    const filteredProducts = products.filter(
      (pro) => pro.category === category,
    );
    return res.render("products", { products: filteredProducts, category });
  }

  return res.render("products", { products, category });
});


app.listen(PORT, () => {
    console.log(`Server is Running on PORT: ${PORT}`);
})