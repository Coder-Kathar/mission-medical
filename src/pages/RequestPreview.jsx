import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { RequestContext } from "../context/RequestContext";
import "./RequestPreview.css";

function RequestPreview(){

    const { requestItems, setRequestItems } = useContext(RequestContext);

    const needsPrescription = requestItems.some(
        (item) => item.requiresPrescription === true
    );

    const [customerName, setCustomerName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [prescription, setPrescription] = useState(null);

    const [lastRequest, setLastRequest] = useState(() => {
        const savedRequest = localStorage.getItem("lastRequest");
        return savedRequest ? JSON.parse(savedRequest) : null;
    });

    const [showConfirmation, setShowConfirmation] = useState(false);

    const [submittedItems, setSubmittedItems] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if(isSubmitted) return;

        if(requestItems.length === 0){
            alert("Please add at least one product to your request.");
            return;
        }

        if(!/^[a-zA-Z\s]+$/.test(customerName.trim())){
            alert("Please enter a valid name using letters only.");
            return;
        }

        if(!/^\d{10}$/.test(mobileNumber)){
            alert("Please enter a valid 10-digit mobile number.")
            return;
        }

        if(!deliveryAddress.trim()){
            alert("Please enter a valid delivery address.");
            return;
        }

        if(needsPrescription && !prescription){
            alert("Please upload a prescription for Drug product");
            return;
        }

        const newOrder = {
            id: `MM${Date.now()}`,
            date: new Date().toLocaleString(),
            customerName,
            mobileNumber,
            deliveryAddress,
            requestItems,
            prescriptionName: prescription?.name || null,
            status: "Pending"
        };

        const existingOrders =
            JSON.parse(localStorage.getItem("orders")) || [];

        existingOrders.push(newOrder);

        localStorage.setItem("orders", JSON.stringify(existingOrders));
        setOrderId(newOrder.id);

        localStorage.setItem(
            "lastRequest",
            JSON.stringify({
                customerName,
                mobileNumber,
                deliveryAddress,
                requestItems,
                createdAt: new Date().toISOString()
            })
        );

        setLastRequest({
            customerName,
            mobileNumber,
            deliveryAddress,
            requestItems,
            createdAt: new Date().toISOString()
        });

        setSubmittedItems(requestItems);
        setIsSubmitted(true);
        setRequestItems([]);
    };

    return(

        <main className="request-preview-page">
            <h1>Review Your Request</h1>

            {lastRequest && !isSubmitted && (
                <div className="request-item">
                    <h2>Your Previous Request</h2>

                    <p>Customer: {lastRequest.customerName}</p>
                    <p>Mobile: {lastRequest.mobileNumber}</p>
                    <p>Address: {lastRequest.deliveryAddress}</p>

                    <h3>Products</h3>

                    {lastRequest.requestItems.map((item, index) => (
                        <p key={index}>
                            {item.name} - {item.quantity} {item.quantityType}
                        </p>
                    ))}

                    <button
                        type="button"
                        onClick={() => {
                            setCustomerName(lastRequest.customerName);
                            setMobileNumber(lastRequest.mobileNumber);
                            setDeliveryAddress(lastRequest.deliveryAddress);
                            setShowConfirmation(true);
                        }}>
                        Use Previous Details
                    </button>
                </div>
            )}

            {showConfirmation && (
                <div>
                    <p>Would you like to create a new request using your previous products?</p>

                    <button
                        type="button"
                        onClick={() => {
                            setRequestItems(lastRequest.requestItems);
                            setShowConfirmation(false);
                            alert("Previous products loaded. Review your request before submitting.");
                        }}>
                        Confirm
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowConfirmation(false)}>
                        Cancel
                    </button>
                </div>
            )}

            {isSubmitted && (
                <div className="request-item">
                    <h2>Request Submitted Successfully!</h2>
                    <p><strong>Order ID:</strong> {orderId}</p>
                    <p><strong>Status:</strong> Pending</p>
                    {prescription && (
                        <p>
                            <strong>Prescription Attached:</strong> {prescription.name}
                        </p>
                    )}
                    <p>
                        Your request is ready for pharmacy review.
                        The pharmacy will contact you to confirm availability and delivery.
                    </p>
                    <p><strong>Customer Name: </strong>{customerName}</p>
                    <p><strong>Mobile Number: </strong>{mobileNumber}</p>
                    <p><strong>Delivery Address: </strong>{deliveryAddress}</p>

                    <h3>Requested Products</h3>

                    {submittedItems.map((item, index) => (
                        <p key={index}>
                            {item.name} - {item.quantity} {item.quantityType}
                            {item.quantityType === "strip" && 
                                ` (${item.quantity * item.tabletsPerStrip} tablets)`}
                        </p>
                    ))}

                    <Link to="/products" className="request-action-button">Continue Shopping</Link>
                </div>
            )}

            {requestItems.length === 0  && !isSubmitted ? (
                <>
                    <p>Your request is empty.</p>
                    <Link to="/products" className="request-action-button">Browse Products</Link>
                </>
            ) : (
                <>
                    {!isSubmitted && (
                        <div className="request-item current-request-card">
                            <h2>Your Current Request</h2>

                            {requestItems.map((item, index) => (
                                <div className="current-request-product" key={`${item.id}-${item.quantityType}-${index}`}>
                                    <div className="current-request-product-info">
                                        <h3>{item.name}</h3>

                                        <p>
                                            Quantity Type: {item.quantityType}
                                        </p>

                                        <p>
                                            Quantity: {item.quantity}
                                        </p>

                                        {item.quantityType === "strip" && (
                                            <p>
                                                Total Tablets:{" "}
                                                {item.quantity * item.tabletsPerStrip}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    

                    {!isSubmitted && (
                        <form className="request-item" onSubmit={handleSubmit}>
                            <h3>Delivery Details</h3>

                            <input 
                                type="text"
                                placeholder="Customer Name"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                required />

                            <input 
                                type="tel"
                                placeholder="Mobile Number"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                required />

                            <textarea 
                                placeholder="Delivery Address"
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                required/>

                           
                            <label htmlFor="prescription">
                                {needsPrescription
                                    ? "Prescription required for Drug products *"
                                    : "Upload Prescription (optional)"}
                            </label>

                            <input
                                type="file"
                                id="prescription"
                                accept="image/*"
                                required={needsPrescription}
                                onChange={(e) =>
                                    setPrescription(e.target.files[0] || null)
                                }
                            />

                            {prescription && (
                                <p className="prescription-file-name">
                                    Selected file: {prescription.name}
                                </p>
                            )}


                            <button type="submit" 
                                    disabled={isSubmitted}>
                                Submit Request
                            </button>
                        
                        </form>
                    )}
                    
                    {!isSubmitted && (
                        <Link to="/request" 
                            className="request-action-button secondary-action">
                            Back to Edit Request
                        </Link>  
                    )}
                    
                </>
            )}
        </main>
    );
}

export default RequestPreview;