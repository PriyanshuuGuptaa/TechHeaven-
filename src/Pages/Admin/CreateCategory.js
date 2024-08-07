import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../Context/authContext'
import "./Dashboard.css";
import axios from 'axios';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ButtonGroup from '@mui/material/ButtonGroup';
import Modal from '@mui/material/Modal';




const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const CreateCategory = () => {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [updatedName, setupdatedName] = useState("");
    const [id, setId] = useState("");
    const [categoryImage, setCategoryImage] = useState();
    const [imagePreviews, setImagePreviews] = useState([]);


    const buttons = [
        <Button key="one" sx={{ borderColor: 'black' }}>
            <Link to="/dashboard/admin/create-category" style={{ textDecoration: "none", color: 'black' }} >Create Category</Link>
        </Button>,
        <Button key="two" sx={{ borderColor: 'black' }}>

            <Link to="/dashboard/admin/create-product" style={{ textDecoration: "none", color: 'black' }}>Create Product</Link>
        </Button>,
        <Button key="three" sx={{ borderColor: 'black' }}>

            <Link to="/dashboard/admin/products" style={{ textDecoration: "none", color: 'black' }}>Products</Link>
        </Button>,
        <Button key="four" sx={{ borderColor: 'black' }}>
            <Link to="/dashboard/admin/users" style={{ textDecoration: "none", color: 'black' }}>Users</Link>
        </Button>

    ];

    const getAllCategories = async () => {
        const category = await axios.get(`${process.env.BACKEND_URL}/api/v1/category/allCategories`);
        setCategories(category.data.allCategories);

    }

    useEffect(() => {
        getAllCategories();
    }, [])

    //create category
    const handleNewCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("categoryName", categoryName);
            if (categoryImage) {

                formData.append("categoryImage", categoryImage);
            }
            const { data } = await axios.post(`${process.env.BACKEND_URL}/api/v1/category/create-category`, formData);
            if (data?.success) {
                toast.success(`${categoryName} is created`)
                getAllCategories();

            }

        } catch (error) {
            console.log("Error in creating category")
        }


    }

    //delete category
    const deleteCategory = async (id) => {
        try {
            const { data } = await axios.delete(`${process.env.BACKEND_URL}/api/v1/category/deleteCategory/${id}`);
            if (data.success) {
                toast.success("category deleted");
                getAllCategories();
            }
            else {
                toast.error(data.messsage);
            }
        } catch (error) {
            toast.error("Error in deleting")
            console.log(error)
        }

    }

    //update category 
    const updateCategory = async () => {
        try {
            const { data } = await axios.put(`${process.env.BACKEND_URL}/api/v1/category/update-category/${id}`, { categoryName: updatedName });
            if (data.success) {
                toast.success("category updated ");
                getAllCategories();
                handleClose();
            }
        } catch (error) {
            toast.error("Error in updating")
            console.log(error)
        }
    }
    const uploadImage = (e) => {
        const files = Array.from(e.target.files);
        setCategoryImage(files[0]);
        const filePreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prevPreviews => [...prevPreviews, ...filePreviews]);
    }
    return (
        <div className='admin-dashboard-container'>
            <h1>ADMIN DASHBOARD</h1>
            <div >
                <div className='admin-menu'>
                    <ButtonGroup size="large" aria-label="Large button group"  >
                        {buttons}
                    </ButtonGroup>

                </div>
                <div className='create-category-details'>
                    <h3>CREATE CATEGORY</h3>
                    <div className='new-category'>
                        <form onSubmit={handleNewCategorySubmit}>
                            <Box sx={{ width: 500, maxWidth: '100%', margin: 2 }}>
                                <TextField fullWidth label="Enter New Category" id="fullWidth" onChange={(e) => { setCategoryName(e.target.value) }} />
                            </Box>

                            <div className='category-images'>
                                <label htmlFor='category-input' className='category-input-label'>Upload image:</label>
                                <input type="file" multiple onChange={uploadImage} id='category-input' />
                                <div className='image-previews'>
                                    {imagePreviews.map((img) => (
                                        <img
                                            src={img}
                                            alt={`Preview`}
                                            style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '10px' }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <button type='submit' className='category-submit-btn'>Submit</button>
                        </form>
                    </div>
                    <div className='category-table'>


                        <table>

                            {categories.map((e) => {
                                return <>
                                    <tr>
                                        <td key={e._id} className='category-list-name'>{e.categoryName} </td>
                                        <td><button className='category-list-btn' onClick={() => {
                                            setOpen(true);
                                            setId(e._id);
                                        }}>Edit</button></td>
                                        <td><button className='category-list-btn delete' onClick={() => { deleteCategory(e._id) }}>Delete</button>
                                        </td>

                                        <Modal
                                            open={open}
                                            onClose={handleClose}
                                            aria-labelledby="modal-modal-title"
                                            aria-describedby="modal-modal-description"
                                        >
                                            <form onSubmit={updateCategory}>
                                                <Box sx={style}>
                                                    <TextField fullWidth label="Enter New Category" id="fullWidth" onChange={(e) => { setupdatedName(e.target.value) }} />
                                                    <Button variant='contained' size="small" type='submit'>Submit</Button>
                                                </Box>
                                            </form>
                                        </Modal>

                                    </tr>

                                </>
                            })}
                        </table>
                    </div>


                </div>
            </div>
        </div>)
}

export default CreateCategory