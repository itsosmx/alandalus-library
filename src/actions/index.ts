"use server"
export async function get_products_server() {
  try {
    const ql = JSON.stringify({
      query: `query {
  products {
    id
    name
    images {
      id
      url
      fileName
      width
      height
    }
    price
    sale
    createdAt
    inStock
    description{
      text
    }
  }
}`
    })

    const response = await fetch(process.env.NEXT_PUBLIC_CMS_URL!, {
      method: "POST",
      body: ql,
    });


    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }


    const data = await response.json();



    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}