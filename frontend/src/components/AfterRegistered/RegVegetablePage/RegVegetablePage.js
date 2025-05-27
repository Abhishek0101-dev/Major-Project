import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RegVegetablePage.css";
import Navbar from "../../NavbarRegistered/NavbarRegistered";
import FooterNew from "../../Footer/FooterNew";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faSquarePlus,
  faCartPlus,
  faTrash,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

function VegetablePage() {
  const [products, setProducts] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
  });
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null); // for tracking which item is being edited

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8070/vegetable/");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching vegetables:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("quantity", formData.quantity);
    if (image) data.append("image", image);

    try {
      if (editId) {
        // Update existing vegetable
        await axios.put(
          `http://localhost:8070/vegetable/update/${editId}`,
          data
        );
        alert("Vegetable updated successfully!");
      } else {
        // Add new vegetable
        await axios.post("http://localhost:8070/vegetable/add", data);
        alert("Vegetable added successfully!");
      }

      setFormData({ name: "", price: "", quantity: "" });
      setImage(null);
      setEditId(null);
      setFormVisible(false);
      fetchProducts();
    } catch (error) {
      console.error("Error saving vegetable:", error);
      alert("Failed to save vegetable.");
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    });
    setEditId(product._id);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vegetable?")) return;

    try {
      await axios.delete(`http://localhost:8070/vegetable/delete/${id}`);
      alert("Vegetable deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting vegetable:", error);
      alert("Failed to delete vegetable.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="nothing-cateogory-pages-veg"></div>

      <div className="search-container-veg">
        <input
          type="text"
          placeholder="Search vegetables..."
          className="search-input-veg"
        />
        <button className="search-button-veg">
          <FontAwesomeIcon icon={faSearch} />
        </button>

        <button
          className="add-products-button"
          onClick={() => {
            setFormVisible(!formVisible);
            setEditId(null);
            setFormData({ name: "", price: "", quantity: "" });
            setImage(null);
          }}
        >
          <FontAwesomeIcon icon={faSquarePlus} />{" "}
          {editId ? "Edit Vegetable" : "Add New Vegetable"}
        </button>

        <button
          className="make-order-button-veg"
          onClick={() => {
            window.location.href = "http://localhost:3000/order";
          }}
        >
          <FontAwesomeIcon icon={faCartPlus} /> {"  "} Make an Order
        </button>
      </div>

      {/* Add/Edit Vegetable Form */}
      {formVisible && (
        <div className="add-vegetable-form-container">
          <h2>{editId ? "Update Vegetable" : "Add New Vegetable"}</h2>
          <form onSubmit={handleFormSubmit} encType="multipart/form-data">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              required
            />
            <input type="file" onChange={handleImageChange} accept="image/*" />
            <button type="submit">
              {editId ? "Update Vegetable" : "Add Vegetable"}
            </button>
          </form>
        </div>
      )}

      {/* Product Cards */}
      <div className="products-container-veg">
        {products.length > 0 ? (
          products.map((product) => (
            <div className="products-item-veg" key={product._id}>
              <a
                href={`/order?image=${encodeURIComponent(
                  product.image
                )}&item=${encodeURIComponent(product.name)}&category=Veg`}
                className="product-item-veg-link"
              >
                <img
                  src={`http://localhost:8070/uploads/${product.image}`}
                  alt={product.name}
                />
                <p>{product.name}</p>
                <p>Price: ₹{product.price}</p>
                <p>Qty: {product.quantity}</p>
              </a>
              <div className="action-buttons">
                <button onClick={() => handleEdit(product)} className="edit-btn">
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="delete-btn"
                >
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No vegetable products found.</p>
        )}
      </div>

      <div className="nothing-cateogory-pages-below-veg"></div>
      <FooterNew />
    </div>
  );
}

export default VegetablePage;
