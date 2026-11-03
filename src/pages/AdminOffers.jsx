import { useState, useRef, useEffect } from "react";
import "./AdminOffers.css";

function AdminOffers() {
    const initialForm = {
        title: "",
        description: "",
        type: "image-text",
        image: "",
        published: false
    };

    const [offers, setOffers] = useState(() => {
        try {
            return JSON.parse(
                localStorage.getItem("medicalOffers")
            ) || [];
        } catch {
            return [];
        }
    });
    const [formData, setFormData] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);

    // Save offers whenever the list changes
    useEffect(() => {
        localStorage.setItem("medicalOffers", JSON.stringify(offers));
    }, [offers]);

    // Reference to the image file input
    const imageInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            e.target.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            setFormData((prev) => ({
                ...prev,
                image: reader.result
            }));
        };

        reader.readAsDataURL(file);
    };

    // Reset form and file input
    const resetForm = () => {
        setFormData({ ...initialForm });
        setEditingId(null);

        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    // Create or update offer
    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.type !== "text-only" && !formData.image) {
            alert("Please upload an offer image.");
            return;
        }

        if (
            formData.type !== "image-only" &&
            !formData.description.trim()
        ) {
            alert("Please enter the offer description.");
            return;
        }

        if (editingId !== null) {
            setOffers((prev) =>
                prev.map((offer) =>
                    offer.id === editingId
                        ? { ...formData, id: editingId }
                        : offer
                )
            );
        } else {
            const newOffer = {
                ...formData,
                id: Date.now()
            };

            setOffers((prev) => [...prev, newOffer]);
        }

        resetForm();
    };

    // Edit offer
    const handleEdit = (offer) => {
        setFormData({
            title: offer.title,
            description: offer.description,
            type: offer.type,
            image: offer.image,
            published: offer.published
        });

        // Clear the native file input.
        // The existing image remains available through formData.image.
        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }

        setEditingId(offer.id);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Delete offer
    const handleDelete = (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this offer?"
        );

        if (!confirmDelete) return;

        setOffers((prev) =>
            prev.filter((offer) => offer.id !== id)
        );

        if (editingId === id) {
            resetForm();
        }
    };

    // Publish / Unpublish offer
    const togglePublish = (id) => {
        setOffers((prev) =>
            prev.map((offer) =>
                offer.id === id
                    ? { ...offer, published: !offer.published }
                    : offer
            )
        );
    };

    return (
        <main className="admin-offers-page">

            <header className="admin-offers-header">
                <h1>Manage Promotional Offers</h1>
                <p>
                    Create and manage offers displayed on the customer homepage.
                </p>
            </header>

            {/* Create / Edit Offer Form */}
            <section className="offer-form-card">

                <h2>
                    {editingId !== null
                        ? "Edit Offer"
                        : "Create New Offer"}
                </h2>

                <form className="offer-form" onSubmit={handleSubmit}>

                    <div className="offer-form-group">
                        <label htmlFor="offer-title">
                            Offer Title
                        </label>

                        <input
                            id="offer-title"
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter offer title"
                            required
                        />
                    </div>

                    <div className="offer-form-group">
                        <label htmlFor="offer-type">
                            Offer Type
                        </label>

                        <select
                            id="offer-type"
                            name="type"
                            value={formData.type}
                            onChange={(e) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    type: e.target.value
                                }));
                            }}
                        >
                            <option value="image-only">
                                Image Only
                            </option>

                            <option value="image-text">
                                Image with Text
                            </option>

                            <option value="text-only">
                                Text Only
                            </option>
                        </select>
                    </div>

                    {formData.type !== "image-only" && (
                        <div className="offer-form-group">
                            <label htmlFor="offer-description">
                                Offer Description
                            </label>

                            <textarea
                                id="offer-description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter offer description"
                                required={formData.type === "text-only"}
                            />
                        </div>
                    )}

                    {formData.type !== "text-only" && (
                        <div className="offer-form-group">
                            <label htmlFor="offer-image">
                                Upload Offer Image
                            </label>

                            <input
                                ref={imageInputRef}
                                id="offer-image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />

                            {formData.image && (
                                <img
                                    src={formData.image}
                                    alt="Offer preview"
                                    className="offer-image-preview"
                                />
                            )}
                        </div>
                    )}

                    <div className="offer-form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.published}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        published: e.target.checked
                                    }))
                                }
                            />
                            {" "}Publish this offer
                        </label>
                    </div>

                    <div className="offer-form-actions">

                        <button
                            type="submit"
                            className="offer-primary-button"
                        >
                            {editingId !== null
                                ? "Update Offer"
                                : "Create Offer"}
                        </button>

                        {editingId !== null && (
                            <button
                                type="button"
                                className="offer-secondary-button"
                                onClick={resetForm}
                            >
                                Cancel Edit
                            </button>
                        )}

                    </div>

                </form>
            </section>

            {/* Existing Offers */}
            <section className="existing-offers-section">

                <h2>Existing Offers ({offers.length})</h2>

                {offers.length === 0 ? (
                    <p>No offers created yet.</p>
                ) : (
                    <div className="offer-list">

                        {offers.map((offer) => (
                            <article
                                className="offer-card"
                                key={offer.id}
                            >

                                {offer.image && (
                                    <img
                                        src={offer.image}
                                        alt={offer.title}
                                    />
                                )}

                                <h3>{offer.title}</h3>

                                {offer.description && (
                                    <p>{offer.description}</p>
                                )}

                                <p>
                                    Type: {offer.type}
                                </p>

                                <span
                                    className={`offer-status ${
                                        offer.published
                                            ? "published"
                                            : "unpublished"
                                    }`}
                                >
                                    {offer.published
                                        ? "Published"
                                        : "Unpublished"}
                                </span>

                                <div className="offer-card-actions">

                                    <button
                                        type="button"
                                        className="offer-secondary-button"
                                        onClick={() => handleEdit(offer)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        className="offer-secondary-button"
                                        onClick={() => togglePublish(offer.id)}
                                    >
                                        {offer.published
                                            ? "Unpublish"
                                            : "Publish"}
                                    </button>

                                    <button
                                        type="button"
                                        className="offer-delete-button"
                                        onClick={() => handleDelete(offer.id)}
                                    >
                                        Delete
                                    </button>

                                </div>

                            </article>
                        ))}

                    </div>
                )}

            </section>

        </main>
    );
}

export default AdminOffers;
