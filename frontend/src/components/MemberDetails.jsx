import React, { useState, useEffect } from "react";
import axios from "axios";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
// import { useNotification } from "./NotificationContext";

function MemberDetails({ customer, onBack }) {

    const baseURL = import.meta.env.VITE_BASE_URL || 'https://app.progryss.com/';
    const initialEditValues = {

        name: `${customer.firstName} ${customer.lastName}`,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zip: customer.zip,
        countryCode: customer.countryCode,
        dueDate: customer.dueDate,
        relationship: customer.relationship,
        customerId: customer.customerId,
        companyId: customer.companyId,
        locationId: customer.locationId,
        companyRoleId: customer.companyRoleId,
        companyContactId: customer.companyContactId,
        newsletter: customer.newsletter,
        comments: customer.comments
    };

    const [comment, setComment] = useState("");
    const [isReadOnly, setIsReadOnly] = useState(true);
    //   const { showNotification } = useNotification();
    const [editableValues, setEditableValues] = useState(initialEditValues);
    const [flyObject, setFlyObject] = useState(initialEditValues);

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleCommentDelete = (index) => {
        editableValues.comments.splice(index, 1);
        // console.log(editableValues.comments)
        setEditableValues((object) => ({
            ...object,
            comments: editableValues.comments
        }))
    };

    const editEnquiry = () => {
        // console.log('edit start');
        setIsReadOnly(false);
    }

    const saveEnquiry = async () => {
        // console.log('enquiry save');
        setEditableValues(flyObject)
        setIsReadOnly(true);
    }

    const handleChange = (field, value) => {
        setFlyObject(prev => ({ ...prev, [field]: value }));
    };

    const cancelEdit = () => {
        setFlyObject(initialEditValues);
        setIsReadOnly(true);
    }

    useEffect(() => {
        console.log('useeffect')
        hit()
    }, [editableValues])

    async function hit() {
        // console.log(editableValues)
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const response = await axios.put(`${baseURL}/update-user/${customer._id}`, editableValues, config);
            console.log(response.data);
        } catch (error) {
            console.log('Error sending PUT request', error);
        }
    }

    const handleCommentSubmit = async () => {
        if (comment.trim() !== "") {
            const now = new Date();
            const timestamp = now.toLocaleString();
            const newComment = { comment_text: comment, comment_date: timestamp };
            const updatedCommentsList = [newComment, ...editableValues.comments];

            setEditableValues((object) => ({
                ...object,
                comments: updatedCommentsList
            }));

            setComment("");
            //   showNotification('Comment added successfully!', 'success', 'green', 'white');
        } else {
            //   showNotification("Can't be blank!", "error", "red", "white");
        }
    };

    return (
        <div className="container-fluid customer-details mt-3">
            <div className="card mb-3">
                <div className="card-body p-0 d-flex">
                    <div className="bg-light add-cutomer-section p-3">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-2">
                                        <span><i className="fa fa-arrow-left" onClick={onBack}></i></span>
                                        <span><AccountCircleOutlinedIcon variant="outlined" sx={{ fontSize: "50px" }} /></span>
                                        <span>
                                            <h5 className="mb-0"><strong>{customer.name}</strong></h5>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex gap-5 p-3">
                        <div>
                            <div className="label-title">Name:</div>
                            <div className="label-value">{flyObject.name}</div>
                        </div>
                        <div>
                            <div className="label-title">Phone Number:</div>
                            <div className="label-value">
                                <a href={`https://wa.me/${flyObject.phone}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#4199FD' }}>
                                    {flyObject.phone}
                                </a>
                            </div>
                        </div>
                        <div>
                            <div className="label-title">Email:</div>
                            <div className="label-value">
                                <a href={`mailto:${flyObject.email}`} style={{ textDecoration: 'none', color: '#4199FD' }}>
                                    {flyObject.email}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="customer-details-grid">
                <div className="mb-3">
                    <div className="card">
                        <div className="card-body" sx={{ position: 'relative' }}>
                            <div className="detail-tab-box d-flex justify-content-between pb-2">
                                <div></div>
                                <div>
                                    {!isReadOnly ? (<><button className="btn btn-secondary me-2 btn-sm" onClick={cancelEdit}>Cancel</button><button className="btn btn-primary me-2 saveBtn btn-sm" onClick={saveEnquiry}>Update</button></>) : (<><button className='btn btn-link me-2 updateBtn' onClick={editEnquiry}><i className="fa fa-edit"></i></button></>)}
                                </div>
                            </div>
                            <div className="two-column-layout">
                                <h6 className="mb-3">Questions</h6>
                                <div className="second-column-box">
                                    <div className="mb-4">
                                        <div className="label-title">Due Date / Birth Date:</div>
                                        <input type="date" className="label-value" onChange={(e) => handleChange('dueDate', e.target.value)} readOnly={isReadOnly} value={flyObject.dueDate} />
                                    </div>
                                    <div className="mb-4">
                                        <div className="label-title">Relationship to little person :</div>
                                        <select
                                            className="label-value"
                                            value={flyObject.relationship}
                                            onChange={(e) => handleChange('relationship', e.target.value)}
                                            disabled={isReadOnly}
                                        >
                                            <option value="">Select</option>
                                            <option value="father">Father</option>
                                            <option value="mother">Mother</option>
                                            <option value="grandparent">Grandparent</option>
                                            <option value="friend">Friend</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card mt-3">
                        <div className="two-column-layout card-body">
                            <h6 className="mb-3">User Details</h6>
                            <div className="first-column-box">
                                <div className="mb-4">
                                    <div className="label-title">Name:</div>
                                    <input className="label-value" onChange={(e) => handleChange('name', e.target.value)} value={flyObject.name} readOnly={true} />
                                </div>
                                <div className="mb-4">
                                    <div className="label-title">Email:</div>
                                    <input className="label-value" onChange={(e) => handleChange('email', e.target.value)} readOnly={true} value={flyObject.email} />
                                </div>
                                <div className="mb-4">
                                    <div className="label-title">Phone Number:</div>
                                    <input className="label-value" onChange={(e) => handleChange('phone', e.target.value)} readOnly={true} value={flyObject.phone} />
                                </div>
                                <div className="mb-4">
                                    <div className="label-title">Newsletter :</div>
                                    <input className="label-value" onChange={(e) => handleChange('newsletter', e.target.value)} readOnly={true} value={flyObject.newsletter} />
                                </div>
                            </div>
                            <h6 className="mb-3">Shipping Details</h6>
                            <div className="second-column-box">
                                <div className="mb-4">
                                    <div className="label-title">Address :</div>
                                    <input className="label-value" onChange={(e) => handleChange('address', e.target.value)} readOnly={true} value={flyObject.address} />
                                </div>
                                <div className="mb-4">
                                    <div className="label-title">City:</div>
                                    <input className="label-value" onChange={(e) => handleChange('city', e.target.value)} readOnly={true} value={flyObject.city} />
                                </div>
                                <div className="mb-4">
                                    <div className="label-title">State:</div>
                                    <input className="label-value" onChange={(e) => handleChange('state', e.target.value)} readOnly={true} value={flyObject.state} />
                                </div>
                                <div className="mb-4">
                                    <div className="label-title">Zip:</div>
                                    <input className="label-value" onChange={(e) => handleChange('zip', e.target.value)} readOnly={true} value={flyObject.zip} />
                                </div>
                                <div className="mb-4">
                                    <div className="label-title">Country Code:</div>
                                    <select
                                        className="label-value"
                                        value={flyObject.countryCode}
                                        onChange={(e) => handleChange('countryCode', e.target.value)}
                                        disabled={true}
                                    >
                                        <option value="">Select</option>
                                        <option value="IN">India</option>
                                    </select>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
                <div className="card mb-3">
                    <div className="card-body">
                        <div className="textarea-box">
                            <textarea
                                rows="3"
                                className="form-control mb-3"
                                value={comment}
                                onChange={handleCommentChange}
                                placeholder="Write your comment here..."
                            ></textarea>
                            <button
                                className="btn btn-primary mb-3"
                                onClick={handleCommentSubmit}
                            >
                                Post Comment
                            </button>
                        </div>
                        <div className="comment-box">
                            {editableValues.comments.length > 0 && (
                                <>
                                    {editableValues.comments.map((comment, index) => (
                                        <div key={index} className="card mb-3">
                                            <div className="card-body pb-1">

                                                <div>
                                                    <div className="comment-text mb-2"><pre style={{ fontFamily: "inherit" }}>{comment.comment_text}</pre></div>
                                                    <hr className="m-0 mt-3 mb-2" />
                                                    <div className="comment-timestamp d-flex justify-content-between align-items-baseline">
                                                        <div>
                                                            <span className="fs-12">{comment.comment_date}</span>
                                                        </div>
                                                        <div>
                                                            <button className="btn btn-link text-danger" onClick={(e) => handleCommentDelete(index)}><i className="fa fa-trash"></i></button>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MemberDetails;
