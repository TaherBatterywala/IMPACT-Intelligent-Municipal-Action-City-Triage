import { createContext, useState, useContext } from 'react';
import API from '../services/api';

const ComplaintContext = createContext();

export const useComplaint = () => useContext(ComplaintContext);

export const ComplaintProvider = ({ children }) => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchMyComplaints = async () => {
        setLoading(true);
        try {
            const res = await API.get('/complaints/my');
            setComplaints(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // For officer
    const fetchOfficerComplaints = async () => {
        setLoading(true);
        try {
            const res = await API.get('/complaints/officer');
            setComplaints(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const createComplaint = async (complaintData) => {
        setLoading(true);
        try {
            const res = await API.post('/complaints', complaintData);
            // The backend returns { msg: "...", complaint: { ... } }
            const newComplaint = res.data.complaint || res.data;
            setComplaints([...complaints, newComplaint]);
            return newComplaint;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateComplaintStatus = async (id, data) => {
        try {
            const res = await API.put(`/complaints/${id}`, data);
            setComplaints(complaints.map(c => c._id === id ? res.data : c));
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    return (
        <ComplaintContext.Provider value={{
            complaints,
            loading,
            fetchMyComplaints,
            createComplaint,
            fetchOfficerComplaints,
            updateComplaintStatus
        }}>
            {children}
        </ComplaintContext.Provider>
    );
};
