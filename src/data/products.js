import paracetamolImage from "../assets/paracetamol.jpg";
import vitaminCImage from "../assets/vitamin-c.jpg";
import sanitizerImage from "../assets/hand-sanitizer.jpg";
import babyLotionImage from "../assets/baby-lotion.webp";

const products = [
    {
        id: 1,
        name: "Paracetamol 500mg",
        category: "medicines",
        description: "Pain and fever relief",
        usage: "Used for reducing body pain and fever",
        image: paracetamolImage,
        quantityType: "tablet",
        tabletsPerStrip: 10,
        requiresPrescription: false,
    },

    {
        id: 2,
        name: "Vitamin C Tablets",
        category: "vitamins",
        description: "Daily vitamin supplement",
        usage: "Used as a vitamin supplement",
        image: vitaminCImage,
        quantityType: "tablet",
        tabletsPerStrip: 10,
        requiresPrescription: false,
    },

    {
        id: 3,
        name: "Hand Sanitizer",
        category: "personal-care",
        description: "Hand hygiene protection",
        usage: "Used for hand hygiene",
        image: sanitizerImage,
        quantityType: "piece",
        requiresPrescription: false,
    },

    {
        id: 4,
        name: "Baby Lotion",
        category: "baby-care",
        description: "Gentle care for babies",
        usage: "Used for baby skin care",
        image: babyLotionImage,
        quantityType: "piece",
        requiresPrescription: false,
    },
];

export default products;