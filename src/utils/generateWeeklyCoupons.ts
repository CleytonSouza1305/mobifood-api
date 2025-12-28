// PARÂMETROS:
// Verificar se é um semanal,
// Verificar se tem data de inicio,
// Verificar se tem data de término,
// Verificar o tipo do desconto, se é FIXED | PERCENTAGE

import { Coupon } from "../models/Coupon";

// DENTRO DA FUNÇÃO
// Criar uma forma de gerar o código aleatoriamente, se semanal, envolver a palavra WEEK(número da semana),
// Caso não, gerar uma palavra aleatória para o code do cupon
// Gerar uma descrição dinâmicamente e explicativa do coupon
// Definir o valor máximo do desconto que o cupon pode dar
// Definir o limite de usuários que podem usar
// Definir o limite em que um usuário pode usar
// Retornar o cupon

export type DiscountType = "PERCENTAGE" | "FIXED" | "DELIVERY";

function generateWeeklyCouponName() {
  const words = [
    "ECONOMIZE",
    "DESCONTO",
    "OFERTA",
    "PROMOCAO",
    "COMIDA",
    "SABOR",
    "DELÍCIA",
    "FOME",
    "QUENTE",
    "RÁPIDO",
    "CORRA",
    "VIP",
    "ESPECIAL",
    "VOLTA",
    "SAUDADE",
    "SUMIDO",
    "OLA",
    "SEXTOU",
    "FESTA",
    "ALEGRIA",
    "BEBIDA",
    "WEEKEND",
    "FRETE",
    "ENTREGA",
    "GRATIS",
  ];

  return words[Math.floor(Math.random() * words.length)];
}

interface DescriptionContext {
  value: number;
  type: DiscountType;
  couponTitle: string;
  keyword?: string;
}

function generateRandomDescription(context: DescriptionContext): string {
  const formattedValue =
    context.type === "PERCENTAGE"
      ? `${context.value}%`
      : `R$ ${context.value.toFixed(2)}`;

  const templates = {
    generic: [
      `Aproveite ${formattedValue} de desconto em sua próxima compra!`,
      `Use o código ${context.couponTitle} e economize hoje mesmo.`,
      `Não perca: ${formattedValue} OFF esperando por você.`,
      `Sua chance de economizar ${formattedValue} chegou.`,
      `Liberamos um desconto de ${formattedValue} para você. Aproveite!`,
    ],

    urgency: [
      `Corra! ${formattedValue} de desconto por tempo limitado!`,
      `A fome apertou? Ganhe ${formattedValue} OFF agora!`,
      `Oferta relâmpago: use ${context.couponTitle} antes que acabe.`,
      `Última chamada: ${formattedValue} OFF para usar agora.`,
      `O relógio está correndo! Garanta seus ${formattedValue} de desconto.`,
    ],

    food: [
      `Sabor com economia: ${formattedValue} a menos no seu pedido.`,
      `Sua refeição ficou mais barata. Pegue seus ${formattedValue} de desconto.`,
      `Delícia de desconto: use o cupom ${context.couponTitle} agora.`,
      `Hoje é dia de comer bem pagando menos: ${formattedValue} OFF.`,
      `O chef liberou! ${formattedValue} de desconto no seu prato favorito.`,
    ],

    exclusive: [
      `Psiu! Um presente secreto de ${formattedValue} só para você.`,
      `Você merece um mimo: ${formattedValue} OFF com o código ${context.couponTitle}.`,
      `Tratamento VIP: desbloqueamos ${formattedValue} de desconto na sua conta.`,
      `Oferta exclusiva selecionada para o seu perfil: ${formattedValue} OFF.`,
      `Acesso liberado: use ${context.couponTitle} para ${formattedValue} de desconto.`,
    ],

    recovery: [
      `Estamos com saudades! Volte com ${formattedValue} de desconto.`,
      `Faz tempo que não te vemos! Aqui está ${formattedValue} para matar a fome.`,
      `Que tal pedir de novo? Use ${context.couponTitle} e ganhe ${formattedValue}.`,
      `Um bom motivo para voltar: ${formattedValue} a menos no seu pedido.`,
      `Não deixe a gente na saudade. Pegue seus ${formattedValue} OFF.`,
    ],

    weekend: [
      `O fim de semana começou com ${formattedValue} OFF!`,
      `Sextou com 'S' de saldo extra: ${formattedValue} de desconto pra você.`,
      `Bora comemorar? Garanta ${formattedValue} a menos na conta.`,
      `Relaxe e aproveite: use o código ${context.couponTitle} no seu pedido.`,
      `Domingo pede delivery e ${formattedValue} de desconto!`,
    ],

    freeShipping: [
      `Entrega na faixa! Use o código ${context.couponTitle} e não pague nada pelo frete.`,
      `Taxa zero! A entrega hoje é por nossa conta com o cupom ${context.couponTitle}.`,
      `Peça o que quiser: o frete grátis está garantido para você!`,
      `Economize na entrega! Use o cupom e receba seu pedido sem taxas extras.`,
      `Esqueça o valor da entrega. Hoje o frete é totalmente GRÁTIS!`,
      `Sua comida favorita sem custo de entrega? Use o código ${context.couponTitle}.`,
    ],
  };

  let selectedCategory = templates.generic;

  const k = context.keyword?.toUpperCase();

  if (context.type === "DELIVERY") {
    selectedCategory = templates.freeShipping;
  }
  else if (k) {
    if (["FOME", "CORRA", "AGORA", "RÁPIDO"].includes(k)) {
      selectedCategory = templates.urgency;
    } else if (["COMIDA", "SABOR", "DELÍCIA"].includes(k)) {
      selectedCategory = templates.food;
    } else if (["VIP", "ESPECIAL"].includes(k)) {
      selectedCategory = templates.exclusive;
    } else if (["VOLTA", "SAUDADE", "SUMIDO", "OLA"].includes(k)) {
      selectedCategory = templates.recovery;
    } else if (
      ["SEXTOU", "FESTA", "ALEGRIA", "BEBIDA", "WEEKEND"].includes(k)
    ) {
      selectedCategory = templates.weekend;
    }
  }

  const randomIndex = Math.floor(Math.random() * selectedCategory.length);
  return selectedCategory[randomIndex];
}   

export async function generateCoupon(
  isWeekly: boolean,
  startsAt?: Date,
  expiresAt?: Date
) {
  const value = (Math.floor(Math.random() * 12) + 1) * 5;

  const types: DiscountType[] = ["FIXED", "PERCENTAGE", "DELIVERY"];
  const randomType = types[Math.floor(Math.random() * types.length)];

  let couponTitle = generateWeeklyCouponName();
  let keyword = couponTitle;

  if (isWeekly) {
    const data = await Coupon.allCoupon({
      page: 1,
      pageSize: 100,
      sortBy: "createdAt",
      order: "desc",
      where: {
        couponName: { contains: "week", mode: "insensitive" },
      },
    });
    couponTitle = `WEEK${data.count + 1}`;
    keyword = "OFERTA";
  }

  const startsAtDate = startsAt || new Date();
  const expiresAtDate = expiresAt || new Date(new Date().setDate(startsAtDate.getDate() + 7));

  const description = generateRandomDescription({
    value: value,
    type: randomType,
    couponTitle: couponTitle,
    keyword: keyword,
  });

  const newCoupon = {
    couponName: couponTitle,
    code: couponTitle.toUpperCase(),
    description: description,
    discountType: randomType,
    discountValue: randomType === "DELIVERY" ? 0 : value,
    startsAt: startsAtDate,
    expiresAt: expiresAtDate,
    is_active: true,
    usageLimit: 1
  };

  return newCoupon;
}

export async function runWeeklyCouponAutomation() {
  console.log('Criando cupom semanal...');
  try {
    const newCouponData = await generateCoupon(true); 

    await Coupon.create(newCouponData)
    
    console.log('Cupom semanal criado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao criar cupon:', error);
  }
}

