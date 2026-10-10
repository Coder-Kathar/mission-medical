import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { RequestContext } from "../context/RequestContext";

function RequestPreview(){

    const { requestItems, setRequestItems } = useContext(RequestContext);

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

    const handleSubmit = (e) => {
        e.preventDefault();

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

        const needsPrescription = requestItems.some(
            (item) => item.category === "drug"
        );

        if(needsPrescription && !prescription){
            alert("Please upload a prescription for Drug product");
            return;
        }

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
        setOrderId(`MM${Date.now()}`);
        setIsSubmitted(true);
    };

    return(

        <main className="request-page">
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
                    <h2>Request Prepared Successfully!</h2>
                    <p>Order ID: {orderId}</p>
                    <p>Customer Name: {customerName}</p>
                    <p>Mobile Number: {mobileNumber}</p>
                    <p>Delivery Address: {deliveryAddress}</p>

                    <h3>Requested Products</h3>

                    {requestItems.map((item, index) => (
                        <p key={index}>
                            {item.name} - {item.quantity} {item.quantityType}
                            {item.quantityType === "strip" && 
                                ` (${item.quantity * item.tabletsPerStrip} tablets)`}
                        </p>
                    ))}

                    <p>Your request is ready for confirmation.</p>

                    <Link to="/products">Continue Shopping</Link>
                </div>
            )}

            {requestItems.length === 0  && !isSubmitted ? (
                <>
                    <p>Your request is empty.</p>
                    <Link to="/products">Browse Products</Link>
                </>
            ) : (
                <>
                    {!isSubmitted && (
                        requestItems.map((item, index) => (
                            <div className="request-item" key={index}>
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
                        ))
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

                            <label htmlFor="prescription">Upload Prescription(if required)</label>
                            <input 
                                type="file"
                                id="prescription"
                                accept="image/*"
                                onChange={(e) => setPrescription(e.target.files[0] || null)} />
                            
                            <button type="submit">Submit Request</button>
                        
                        </form>
                    )}
                    
                    {!isSubmitted && (
                      <Link to="/request">Back to Edit Request</Link>  
                    )}
                    
                </>
            )}
        </main>
    );
}

export default RequestPreview;