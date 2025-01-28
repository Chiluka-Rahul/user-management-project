import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import './usermanagement.css';

const initialValues = {
  addModal: { name: "", email: "", phone: "" },
  editModal: { name: "", email: "", phone: "" }
};

const UserManagement = () => {
  const [show, setShow] = useState({
    addModal: false,
    editModal: false
  });
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [userDetails, setUserDetails] = useState(initialValues);

  const handleDisplayModal = (modal) => {
    if (show[modal]) return setShow({ ...show, [modal]: false });
    setShow({ ...show, [modal]: true });
  };

  const handleInputChange = (e, modal) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [modal]: {
        ...userDetails[modal],
        [name]: value
      }
    });
  };

  const gettingUsers = async () => {
    try {
      const response = await fetch("https://user-dummy-api.onrender.com/users");
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const setSelectedUser = (selectedUserID) => {
    setUserDetails({
      ...userDetails,
      editModal: users.find((user) => {
        if (user._id === selectedUserID)
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone
          };
      })
    });
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch(
        "https://user-dummy-api.onrender.com/users",
        {
          method: "POST",
          body: JSON.stringify(userDetails.addModal),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      if (response.status === 201) {
        handleDisplayModal("addModal");
        Swal.fire({
          title: "User Added Successfully",
          icon: "success"
        });
        setLoading(true);
        gettingUsers();
        setUserDetails(initialValues);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(
        `https://user-dummy-api.onrender.com/users/${userDetails.editModal._id}`,
        {
          method: "PUT",
          body: JSON.stringify(userDetails.editModal),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 200) {
        handleDisplayModal("editModal");
        Swal.fire({
          title: "User Updated Successfully",
          icon: "success"
        });
        setLoading(true);
        gettingUsers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const userDelete = async (selectedUserID) => {
    try {
      const response = await fetch(
        `https://user-dummy-api.onrender.com/users/${selectedUserID}`,
        {
          method: "DELETE"
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "User Deleted Successfully",
          icon: "success"
        });
        setLoading(true);
        gettingUsers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    gettingUsers();
  }, []);

  const modalVariants = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120 } },
    exit: { y: "-100vh", opacity: 0 }
  };

  const listVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1 }
    })
  };

  return (
    <section className={`main ${loading ? "loading" : ""}`}>
      <div className="container">
        <h3 className="text-center my-4">User Management Dashboard</h3>
        <motion.button
          className="btn btn-primary mb-4"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleDisplayModal("addModal")}
        >
          Add User
        </motion.button>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {users.map((user, index) => (
                <motion.tr
                  key={user._id}
                  custom={index}
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <motion.button
                      className="btn btn-warning mx-2"
                      whileHover={{ scale: 1.1 }}
                      onClick={() => {
                        setSelectedUser(user._id);
                        handleDisplayModal("editModal");
                      }}
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      className="btn btn-danger"
                      whileHover={{ scale: 1.1 }}
                      onClick={() => userDelete(user._id)}
                    >
                      Delete
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        <AnimatePresence>
        {show.addModal && (
                <div
                  className={`modal-overlay ${show.addModal ? "show" : "hide"}`}
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="userAddLabel">
                          Add User
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => handleDisplayModal("addModal")}
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div>
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Name"
                              aria-label="name"
                              name="name"
                              value={userDetails.addModal.name}
                              onChange={(e) => handleInputChange(e, "addModal")}
                            />
                          </div>

                          <div className="input-group mb-3">
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Enter Email"
                              aria-label="email"
                              name="email"
                              value={userDetails.addModal.email}
                              onChange={(e) => handleInputChange(e, "addModal")}
                            />
                          </div>

                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Phone"
                              aria-label="phone"
                              name="phone"
                              value={userDetails.addModal.phone}
                              onChange={(e) => handleInputChange(e, "addModal")}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary me-4"
                          onClick={() => handleDisplayModal("addModal")}
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleAddUser}
                        >
                          Add User
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

{show.editModal && (
                <div
                  className={`modal-overlay ${
                    show.editModal ? "show" : "hide"
                  }`}
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="userEditLabel">
                          Edit User
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => handleDisplayModal("editModal")}
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div>
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Name"
                              aria-label="name"
                              name="name"
                              value={userDetails.editModal.name}
                              onChange={(e) =>
                                handleInputChange(e, "editModal")
                              }
                            />
                          </div>

                          <div className="input-group mb-3">
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Enter Email"
                              aria-label="email"
                              name="email"
                              value={userDetails.editModal.email}
                              onChange={(e) =>
                                handleInputChange(e, "editModal")
                              }
                            />
                          </div>

                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Phone"
                              aria-label="phone"
                              name="phone"
                              value={userDetails.editModal.phone}
                              onChange={(e) =>
                                handleInputChange(e, "editModal")
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary close me-4"
                          aria-label="Close"
                          onClick={() => handleDisplayModal("editModal")}
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleUpdateUser}
                        >
                          Save changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
           

        </AnimatePresence>
      </div>
    </section>
  );
};

export default UserManagement;
