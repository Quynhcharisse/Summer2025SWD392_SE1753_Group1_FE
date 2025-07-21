import { Button, Spinner } from "@atoms";
import { PageTemplate } from "@templates";
import { Baby, Plus, CheckCircle, AlertCircle } from "lucide-react";
import RenderFormPopUp from "./RenderFormPopUp";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChildren , updateChild } from "@api/services/parentService";
import EditChildPopUp from "./EditChildPopUp";

const ChildList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [error, setError] = useState("");
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [admissionTerms, setAdmissionTerms] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [editChildId, setEditChildId] = useState(null);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const response = await getChildren();

        if (response.data) {
          setChildren(response.data);
        } else {
          setChildren([]);
          setError("No child information found");
        }
      } catch (err) {
        setError("Error fetching child list information");
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  useEffect(() => {
    setAdmissionTerms([
      { id: 1, name: "Fall 2025" },
      { id: 2, name: "Spring 2026" },
    ]);
  }, []);

  const handleAddChild = () => {
    navigate("/user/parent/add-child");
  };

  const handleSelectChild = (child) => {
    navigate(`/user/parent/enrollment/application`, {
      state: { studentId: child.id },
    });
  };

  const GetForm = () => setRefresh((r) => !r);

  if (loading) {
    return (
      <PageTemplate title="Child List">
        <div className="text-center py-8">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading child list...</p>
        </div>
      </PageTemplate>
    );
  }
  return (
    <PageTemplate
      title="Child List"
      subtitle="Select a child for enrollment or add a new child"
      actions={
        <Button variant="primary" size="md" onClick={handleAddChild}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Child
        </Button>
      }
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      {children.length === 0 && !error ? (
        <div className="text-center py-12">
          <Baby className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No Child Information
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            You don't have any children registered yet. Please add a child to
            continue.
          </p>
          <Button variant="primary" onClick={handleAddChild}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Child
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => (
            <div
              key={child.id}
              className="bg-white rounded-lg border hover:border-blue-300 shadow-sm hover:shadow transition-all p-6"
            >
              <div className="flex justify-between items-start">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {child.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {child.gender === "male"
                      ? "Male"
                      : child.gender === "female"
                      ? "Female"
                      : "Other"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Baby className="w-6 h-6 text-blue-600" />
                </div>
              </div>

              {/* Form Status Indicator */}
              <div className="mb-4">
                {child.hadForm ? (
                  <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Form Submitted
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">
                      Ready for Enrollment
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex space-x-2">
                  <span className="text-gray-500 text-sm">Date of Birth:</span>
                  <span className="text-gray-700 text-sm">
                    {new Date(child.dateOfBirth).toLocaleDateString("en-US")}
                  </span>
                </div>
                {child.placeOfBirth && (
                  <div className="flex space-x-2">
                    <span className="text-gray-500 text-sm">
                      Place of Birth:
                    </span>
                    <span className="text-gray-700 text-sm">
                      {child.placeOfBirth}
                    </span>
                  </div>
                )}
              </div>
              
              <Button
                variant="primary"
                className="w-full mb-2"
                onClick={() => setIsPopUpOpen(true)}
              >
                Enroll
              </Button>
              
              {/* Conditional Edit Button based on hadForm */}
              {child.hadForm ? (
                <div className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-2 text-center">
                  <span className="text-gray-500 text-sm">
                    Cannot edit - Form already submitted
                  </span>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setEditChildId(child.id)}
                >
                  Edit
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
      <RenderFormPopUp
        handleClosePopUp={() => setIsPopUpOpen(false)}
        isPopUpOpen={isPopUpOpen}
        students={children}
        GetForm={GetForm}
        admissionTerms={admissionTerms}
      />
      <EditChildPopUp
        open={!!editChildId}
        childId={editChildId}
        onClose={() => setEditChildId(null)}
        onSuccess={GetForm}
      />
    </PageTemplate>
  );
};

export default ChildList;
