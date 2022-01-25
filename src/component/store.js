import { writable } from "svelte/store";

export const sample = writable([
    {
        "id": 1235,
        "client": "Samuel",
        "name": "10mm Glass",
        "date": "22-10-2021",
        "material":"some",
        "type":"Type 1",
        "cost":"$10",
        "totalcost":"cost + material",
        "image":"https://5.imimg.com/data5/JF/FS/QE/SELLER-10968011/designer-glass-500x500.jpg",
        "quantity": "10"
      },
      {
        "id": 5433,
        "client": "Ramesh",
        "name": "Table Glass",
        "date": "21-10-2021",
        "material":"some1",
        "type":"Type 1",
        "cost":"$10",
        "totalcost":"cost + material",
        "image":"https://i.pinimg.com/originals/40/98/40/409840affae6d33aeead5c3d9ccbfeb5.jpg",
        "quantity": "30"
      },
      {
        "id": 2134,
        "client": "John",
         "name": "Crafed glass",
        "date": "22-10-2021",
        "material":"some3",
        "type":"Type 2",
        "cost":"$10",
        "totalcost":"cost + material",
        "image":"https://i.pinimg.com/originals/15/ef/2f/15ef2f2521eec2d36d94873f0eb67659.jpg",
        "quantity": "20"
      },
      {
        "id": 6888,
        "client": "Kumar",
        "name": "5 mm gold printed glass",
        "date": "20-10-2021",
        "material":"some2",
        "type":"Type 3",
        "cost":"$10",
        "totalcost":"cost + material",
        "image":"https://5.imimg.com/data5/SELLER/Default/2020/11/JP/JZ/RD/116717221/door-screen-printing-glass-500x500.jpg",
        "quantity": "60"
      },
      {
        "id": 3422,
        "client": "Raj Kamal",
        "name":"10mm sanded glass",
        "date": "20-10-2021",
        "material":"some3",
        "type":"Type 3",
        "cost":"$10",
        "totalcost":"cost + material",
        "image":"https://5.imimg.com/data5/SELLER/Default/2020/11/QQ/YS/PZ/116717221/designer-screen-printing-glass-500x500.jpg",
        "quantity": "22"
      },
      {
        "id": 7866,
        "client": "Vincent",
        "name": "Flower print glass",
        "date": "19-10-2021",
        "material":"some1",
        "type":"Type 2",
        "cost":"$10",
        "totalcost":"cost + material",
        "image":"https://5.imimg.com/data5/NQ/GN/MJ/SELLER-57504119/designer-glass-500x500.jpg",
        "quantity": "35"
      },
      {
        "id": 9966,
        "client": "Kumar",
         "name": "Blue gradient glass",
        "date": "15-10-2021",
        "material":"some2",
        "type":"Type 2",
        "cost":"$10",
        "totalcost":"cost + material",
        "image":"https://5.imimg.com/data5/DI/LJ/BO/SELLER-57472764/bathroom-printed-glass-250x250.jpg",
        "quantity": "10"
      },
      {
        "id": 4432,
        "client": "Krishnan",
         "name": "Gray gradient glass",
        "date": "16-10-2021",
        "material":"some3",
        "type":"Type 1",
        "cost":"$10",
        "totalcost":"cost + material",
        "image":"https://5.imimg.com/data5/TM/RO/MY-25391443/digital-printing-glass-500x500.jpg",
        "quantity": "20"
      },
      {
        "id": 9911,
        "client": "Samuel",
         "name": "Gold printed glass",
        "date": "17-10-2021",
        "material":"some2",
        "type":"Type 3",
        "cost":"$10",
        "totalcost":"cost + material",
        "image":"https://5.imimg.com/data5/QR/HY/OI/SELLER-29144064/decorative-printed-glass-250x250.jpg",
        "quantity": "40"
      },
      {
        "id": 1212,
        "client": "John",
        "name": "Printed glass",
        "date": "18-10-2021",
        "material":"Type 2",
        "type":"varity",
        "cost":"$10",
        "totalcost":"cost + material",
        "image":"https://5.imimg.com/data5/LI/QV/BS/SELLER-64942626/window-printed-glass-250x250.jpg",
        "quantity": "100"
      }
])

export const users = writable([
  {
      "id": 21635,
      "name": "John",
      "date": "22-10-2021",
      "type":"Trader",
      "email":"john@gmail.com",
      "mobile":"123456789",
      "address":"dfgdj dkfgskjg dhgj",
      "orders": ["fghd","gfjf","dhf"]
    },
    {
      "id": 75675,
      "name": "Samuel",
      "date": "12-01-2020",
      "type":"Shop",
      "email":"sam@gmail.com",
      "mobile":"546456456",
      "address":"zxcvsd dkfgskjg dhgj",
      "orders": ["fghd","gfjf"]
    },
    {
      "id": 45466,
      "name": "Ramesh",
      "date": "02-03-2021",
      "type":"Trader",
      "email":"rameh@gmail.com",
      "mobile":"1122332211",
      "address":"bnvvb dkfgskjg dhgj",
      "orders": ["fghd","gfjf","dhf","gfgf","tuy"]
    },
    {
      "id": 35667,
      "name": "Kumar",
      "date": "02-06-2021",
      "type":"Agent",
      "email":"kumar@gmail.com",
      "mobile":"2134555652",
      "address":"cfjjfb dkfgskjg dhgj",
      "orders": ["fghd"]
    },
    {
      "id": 33546,
      "name": "Raj Kamal",
      "date": "12-01-2021",
      "type":"Shop",
      "email":"raj@gmail.com",
      "mobile":"345627836553",
      "address":" dkfgskjg dhgj",
      "orders": ["fghd","gfjf","dhf","dfgj"]
    },
    {
      "id": 33335,
      "name": "Vincent",
      "date": "22-10-2020",
      "type":"Shop",
      "email":"vincen@gmail.com",
      "mobile":"123456789",
      "address":"ljkj dkfgskjg dhgj",
      "orders": ["fghd","gfjf","dhf"]
    },
    {
      "id": 57843,
      "name": "Krishnan",
      "date": "12-01-2019",
      "type":"Trader",
      "email":"krishnan@gmail.com",
      "mobile":"425369812",
      "address":"qewdd dkfgskjg dhgj",
      "orders": ["gfjf","dhf"]
    },
])
