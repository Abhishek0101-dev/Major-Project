import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RegFruitPage.css";

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

function FruitPage() {
  const [products, setProducts] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
  });
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8070/fruit/");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching fruits:", error);
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
        await axios.put(`http://localhost:8070/fruit/update/${editId}`, data);
        alert("Fruit updated successfully!");
      } else {
        await axios.post("http://localhost:8070/fruit/add", data);
        alert("Fruit added successfully!");
      }

      setFormData({ name: "", price: "", quantity: "" });
      setImage(null);
      setEditId(null);
      setFormVisible(false);
      fetchProducts();
    } catch (error) {
      console.error("Error saving fruit:", error);
      alert("Failed to save fruit.");
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
    if (!window.confirm("Are you sure you want to delete this fruit?")) return;

    try {
      await axios.delete(`http://localhost:8070/fruit/delete/${id}`);
      alert("Fruit deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting fruit:", error);
      alert("Failed to delete fruit.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="nothing-cateogory-pages"></div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search fruits..."
          className="search-input"
        />
        <button className="search-button">
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
          {editId ? "Edit Fruit" : "Add New Fruit"}
        </button>

        <button
          className="make-order-button"
          onClick={() => {
            window.location.href = "http://localhost:3000/order";
          }}
        >
          <FontAwesomeIcon icon={faCartPlus} /> {"  "} Make an Order
        </button>
      </div>

      {/* Add/Edit Fruit Form */}
      {formVisible && (
        <div className="add-fruit-form-container">
          <h2>{editId ? "Update Fruit" : "Add New Fruit"}</h2>
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
              {editId ? "Update Fruit" : "Add Fruit"}
            </button>
          </form>
        </div>
      )}

      {/* Product Cards */}
      <div className="products-container">
        {products.length > 0 ? (
          products.map((product) => (
            <div className="products-item" key={product._id}>
              <a
                href={`/order?image=${encodeURIComponent(
                  product.image
                )}&item=${encodeURIComponent(product.name)}&category=Fruit`}
                className="product-item-link"
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
          <p>No fruit products found.</p>
        )}
      </div>

      <div className="nothing-cateogory-pages-below"></div>
      <FooterNew />
    </div>
  );
}

export default FruitPage;
