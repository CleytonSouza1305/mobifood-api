import { PrismaClient } from "../src/generated/prisma";
const prisma = new PrismaClient();

async function main() {
  console.log("Limpando banco de dados...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.products.deleteMany();
  await prisma.restaurants.deleteMany();
  await prisma.user.deleteMany();
  const newUser = await prisma.user.create({
    data: {
      username: "Cleyton Souza",
      email: "cley@gmail.com",
      password: "12345678",
      role: "admin",
      courier: {
        create: {
          isAvailable: true,
          isActive: true,
          balance: 0.0,
        },
      },
      cart: {},
      address: {
        createMany: {
          data: {
            city: 'São Paulo',
            state: 'SP',
            number: '457',
            street: 'Rua bocaina de minas',
            role: 'Casa',
            isActive: true
          }
        }
      },
      favoriteTheme: 'dark',
      phone: '(11) 12345-6789',
    },
  });

  const otherUser = await prisma.user.create({
    data: {
      username: "Raissa Silva",
      email: "rai@gmail.com",
      password: "12345678",
    },
  });

  console.log({ newUser, otherUser });

  const restaurantsData = [
    {
      name: "Burger King",
      category: "FAST_FOOD",
      local: "Av. Paulista, 1000 - SP",
      logoUrl:
        "https://s2.glbimg.com/V0vLGchlI0S7Xll4emaGMIJZSLU=/940x523/e.glbimg.com/og/ed/f/original/2021/01/07/bk-novo_logo.jpg",
      menu: [
        {
          name: "Whopper",
          category: "BURGER",
          price: 29.9,
          description: "Hambúrguer grelhado no fogo.",
          img: "https://d3sn2rlrwxy0ce.cloudfront.net/_800x600_crop_center-center_none/whopper-thumb_2021-09-16-125319_mppe.png?mtime=20210916095320&focal=none&tmtime=20241024134409",
        },
        {
          name: "Batata Média",
          category: "SNACK",
          price: 11.9,
          description: "Batatas fritas crocantes.",
          img: "https://static.ifood-static.com.br/image/upload/t_medium/pratos/6e73dce2-a17f-4aef-9035-1409cea198fe/202401101011_I6VD_i.jpg",
        },
      ],
    },
    {
      name: "McDonald's",
      category: "FAST_FOOD",
      local: "Rua Augusta, 1500 - SP",
      logoUrl:
        "https://updateordie.com/wp-content/uploads/2025/01/mcdonalds_logo.webp",
      menu: [
        {
          name: "Big Mac",
          category: "BURGER",
          price: 28.9,
          description: "Dois hambúrgueres, alface, queijo e molho especial.",
          img: "https://topsecretrecipes.com/images/product/Big%20Mac%201200.jpg",
        },
        {
          name: "McFritas Grande",
          category: "SNACK",
          price: 15.9,
          description: "A batata mais famosa do mundo.",
          img: "https://foconofato.com.br/wp-content/uploads/2021/06/images-2021-06-22T161416.359.jpeg",
        },
      ],
    },
    {
      name: "Pizza Hut",
      category: "PIZZA",
      local: "Shopping Eldorado - SP",
      logoUrl:
        "https://updateordie.com/wp-content/uploads/2025/10/pizza_hut_logo_red_background.png",
      menu: [
        {
          name: "Pizza Pepperoni",
          category: "PIZZA",
          price: 59.9,
          description: "Massa pan com fatias de pepperoni.",
          img: "https://bahiasocialvip.com.br/wp-content/uploads/2024/09/pizza-hut.jpg",
        },
        {
          name: "Breadsticks",
          category: "SNACK",
          price: 19.9,
          description: "Palitinhos de massa assada com alho.",
          img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrHub0JXOCTPM24PYpckiwndliePuGOYZ1mA&s",
        },
      ],
    },
    {
      name: "Domino's Pizza",
      category: "PIZZA",
      local: "Av. Faria Lima, 200 - SP",
      logoUrl:
        "https://media-cdn.tripadvisor.com/media/photo-s/09/5c/64/25/domino-s-pizza-potchefstroom.jpg",
      menu: [
        {
          name: "Pizza Calabresa",
          category: "PIZZA",
          price: 49.9,
          description: "Massa fina com calabresa e cebola.",
          img: "https://storage.shopfood.io/public/companies/o7g9o8g3/products/thumbnail/4091323e3574c73afdf62456f52267a5.jpg",
        },
        {
          name: "Chocobread",
          category: "DESSERT",
          price: 18.9,
          description: "Massa recheada com chocolate.",
          img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP6V2Rhu2-O4pNaCXZU0LXHRr2AgeJxaOmWA&s",
        },
      ],
    },
    {
      name: "Outback Steakhouse",
      category: "OTHERS",
      local: "Shopping Center Norte - SP",
      logoUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbhCNQZY12LhgEnJ7IPNAZiW4QA1r2KC9VxQ&s",
      menu: [
        {
          name: "Ribs on the Barbie",
          category: "OTHERS",
          price: 99.9,
          description: "Costela suína com molho barbecue.",
          img: "https://cdn.outback.com.br/wp-data/wp-content/uploads/2023/12/RibsBarbie.jpg",
        },
        {
          name: "Bloomin' Onion",
          category: "SNACK",
          price: 54.9,
          description: "Famosa cebola gigante e dourada.",
          img: "https://static.foxnews.com/foxnews.com/content/uploads/2020/03/BloominOnionOutback-Steakhouse.jpeg",
        },
      ],
    },
  ];

  for (const res of restaurantsData) {
    await prisma.restaurants.create({
      data: {
        name: res.name,
        category: res.category as any,
        local: res.local,
        logoUrl: res.logoUrl,
        openAt: "11:00",
        closeAt: "23:00",
        menu: {
          create: res.menu.map((item) => ({
            name: item.name,
            category: item.category as any,
            price: item.price,
            description: item.description,
            imageUrl: item.img,
          })),
        },
      },
    });
  }

  console.log("✅ Restaurantes e seus cardápios criados!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
