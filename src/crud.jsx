import React, { useReducer, useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { CiEdit } from "react-icons/ci";
import { AiFillDelete } from "react-icons/ai";

const initialState = [];

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
            return action.payload;
        case 'ADD_USER':
            return [...state, { ...action.payload, id: Date.now() }];
        case 'REMOVE_USER':
            return state.filter(user => user.id !== action.id);
        case 'EDIT_USER':
            return state.map(user => 
                user.id === action.id ? { ...action.payload, id: action.id } : user
            );
        default:
            return state;
    }
};

const CrudApp = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [form, setForm] = useState({
        name: '',
        username: '',
        email: '',
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        axios.get('https://api.escuelajs.co/api/v1/users')
            .then(response => {
                dispatch({ type: 'SET_USER', payload: response.data });
            })
            .catch(error => {
                console.error('Erreur lors du chargement des utilisateurs :', error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target; 
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId !== null) {
            dispatch({ type: 'EDIT_USER', id: editingId, payload: form });
            setEditingId(null);
        } else {
            dispatch({ type: 'ADD_USER', payload: form });
        }
        setForm({ name: '', username: '', email: '' });
    };

    const handleEdit = (user) => {
        setForm(user);
        setEditingId(user.id);
    };

    const handleDelete = (id) => {
        dispatch({ type: 'REMOVE_USER', id });
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">CRUD App </h2>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="name" 
                        value={form.name} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="username" 
                        value={form.username} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        name="email" 
                        value={form.email} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    {editingId !== null ? 'Update User' : 'Add User'}
                </button>
            </form>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {state.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                                <button 
                                    className="btn btn-warning btn-sm me-2" 
                                    onClick={() => handleEdit(user)}
                                >
                                    <CiEdit />
                                </button>
                                <button 
                                    className="btn btn-danger btn-sm" 
                                    onClick={() => handleDelete(user.id)}
                                >
                                    <AiFillDelete />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CrudApp;
