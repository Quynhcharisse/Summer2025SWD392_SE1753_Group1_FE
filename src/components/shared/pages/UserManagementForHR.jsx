import React, { useEffect, useState } from "react";
import { Button, Spinner } from "@atoms";
import apiClient from "@api/apiClient";

const UserManagementForHR = () => {
  const [tab, setTab] = useState("parent");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const url = tab === "parent" ? "/hr/parent" : "/hr/teacher";
      const res = await apiClient.get(url);
      setUsers(res.data?.data || []);
    } catch (err) {
      setError("Unable to load user list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [tab]);

  const handleBan = async (email) => {
    setActionLoading(email);
    setError("");
    setSuccess("");
    try {
      await apiClient.put("/hr/ban", { email });
      setSuccess(`Account locked: ${email}`);
      fetchUsers();
    } catch (err) {
      setError("Unable to lock account.");
    } finally {
      setActionLoading("");
    }
  };

  const handleUnban = async (email) => {
    setActionLoading(email);
    setError("");
    setSuccess("");
    try {
      await apiClient.put("/hr/unban", { email });
      setSuccess(`Account unlocked: ${email}`);
      fetchUsers();
    } catch (err) {
      setError("Unable to unlock account.");
    } finally {
      setActionLoading("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Account Management {tab === "parent" ? "Parents" : "Teachers"}</h2>
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${tab === "parent" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("parent")}
        >
          Parents
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === "teacher" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("teacher")}
        >
          Teachers
        </button>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      {loading ? (
        <Spinner size="lg" />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Full Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(users) && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.email}>
                    <td className="px-4 py-2 border">{user.name || user.fullName || user.email}</td>
                    <td className="px-4 py-2 border">{user.email}</td>
                    <td className="px-4 py-2 border">{user.status || "Active"}</td>
                    <td className="px-4 py-2 border">
                      {user.status === "ban" ? (
                        <Button
                          variant="success"
                          size="sm"
                          disabled={actionLoading === user.email}
                          onClick={() => handleUnban(user.email)}
                        >
                          {actionLoading === user.email ? "Unlocking..." : "Unlock"}
                        </Button>
                      ) : (
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={actionLoading === user.email}
                          onClick={() => handleBan(user.email)}
                        >
                          {actionLoading === user.email ? "Locking..." : "Lock Account"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagementForHR; 