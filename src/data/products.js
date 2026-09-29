import paracetamolImage from "../assets/paracetamol.jpg";
import vitaminCImage from "../assets/vitamin-c.jpg";
import sanitizerImage from "../assets/hand-sanitizer.jpg";
import babyLotionImage from "../assets/baby-lotion.webp";

const products = [
    {
        id: 1,
        name: "Paracetamol 500mg",
        price: 10,
        description: "Pain and fever relief",
        category: "medicines",
        image: paracetamolImage,
    },
    {
        id: 2,
        name: "Vitamin C Tablets",
        price: 25,
        description: "Daily vitamin supplement",
        category: "vitamins",
        image: vitaminCImage,
    },
    {
        id: 3,
        name: "Hand Sanitizer",
        price: 100,
        description: "Hand hygiene protection",
        category: "personal-care",
        image: sanitizerImage,
    },
    {
        id: 4,
        name: "Baby Lotion",
        price: 150,
        description: "Gentle care for babies",
        category: "baby-care",
        image: babyLotionImage,
    },
];

export default products;