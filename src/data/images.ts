// Central image registry, so components import by role rather than by file.
import logoWordmark from "../assets/img/logo-wordmark.png";
import logoFull from "../assets/img/logo-full.png";
import heroAttaBag from "../assets/img/hero-atta-bag.jpg";
import tavaRoti from "../assets/img/tava-roti.jpg";
import familyCheckingPack from "../assets/img/family-checking-pack.jpg";
import manCheckingAtta from "../assets/img/man-checking-atta.jpg";
import adulterationRisk from "../assets/img/adulteration-risk.jpg";
import handsFlour from "../assets/img/hands-flour.jpg";
import wheatField from "../assets/img/wheat-field.jpg";
import qualityAtta from "../assets/img/quality-atta.jpg";
import rollingChapati from "../assets/img/rolling-chapati.jpg";
import flourWheat from "../assets/img/flour-wheat.jpg";
import flourBowlCrop from "../assets/img/flour-bowl-crop.jpg";
import grainsFlatlay from "../assets/img/grains-flatlay.jpg";
import chickpeasGrains from "../assets/img/chickpeas-grains.jpg";
import oatsGrains from "../assets/img/oats-grains.jpg";
import flourClose from "../assets/img/flour-close.jpg";
import coupleKitchen from "../assets/img/couple-kitchen.jpg";
import chapatiStack from "../assets/img/chapati-stack.jpg";
import grainHands from "../assets/img/grain-hands.jpg";
import chakkiMill from "../assets/img/chakki-mill.jpg";
import flourSifting from "../assets/img/flour-sifting.jpg";
import pouchSealed from "../assets/img/pouch-sealed.jpg";
import parathaKitchen from "../assets/img/paratha-kitchen.jpg";

export const img = {
  logoWordmark, logoFull, heroAttaBag, tavaRoti, familyCheckingPack, manCheckingAtta,
  adulterationRisk, handsFlour, wheatField, qualityAtta, rollingChapati, flourWheat,
  grainsFlatlay, chickpeasGrains, oatsGrains, flourClose, coupleKitchen, chapatiStack,
  grainHands, chakkiMill, flourSifting, pouchSealed, parathaKitchen,
};

export const blendImages = {
  chakki: { src: flourBowlCrop, alt: "Wholemeal atta in a wooden bowl beside ears of wheat" },
  multigrain: { src: grainsFlatlay, alt: "Bowls of whole grains, pulses and seeds laid out on a table" },
  protein: { src: chickpeasGrains, alt: "Chickpeas, lentils and whole grains in bowls and jars" },
} as const;

export const goalImages = {
  protein: { src: chickpeasGrains, alt: "" },
  fibre: { src: oatsGrains, alt: "" },
  fresher: { src: flourClose, alt: "" },
  family: { src: tavaRoti, alt: "" },
} as const;

export const processImages = [
  { src: grainHands, alt: "Hands cupping freshly harvested whole grain, a few kernels falling between the fingers", pos: "50% 42%" },
  { src: chakkiMill, alt: "A Poshan miller in a hairnet, gloves and branded apron checks fresh atta as it flows from a stone chakki mill into a stainless bowl, beside sacks of whole grain", pos: "50% 50%" },
  { src: flourSifting, alt: "Freshly milled flour being sifted through a fine stainless-steel sieve", pos: "50% 36%" },
  { src: pouchSealed, alt: "A sealed kraft stand-up pouch ready for labelling", pos: "50% 50%" },
] as const;
