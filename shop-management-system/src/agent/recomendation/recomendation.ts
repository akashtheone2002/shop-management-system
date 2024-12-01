import { IOrder, IProduct } from "@/type";

export default async function getReccomendations(products: IOrder[]): Promise<IProduct[]>{
    const data: IProduct[] = [{
        id: "567",
        name: "Bag",
        price: 100,
        stock: 8,
        image: ""
      },
      {
        id: "569",
        name: "Bottle",
        price: 50,
        stock: 90
      },
      {
        id: "555",
        name: "Pant",
        price: 50,
        stock: 90
      }, {
        id: "534",
        name: "Shirt",
        price: 50,
        stock: 90
      }, {
        id: "509",
        name: "Book",
        price: 50,
        stock: 90
      }];
    return data;
}