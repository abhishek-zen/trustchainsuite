import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserApplications } from "../service/Service";

const ApplicationManager: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkApplications = async () => {
      try {
        const apps = await getUserApplications();

        if (apps.length > 0) {
          navigate("/dashboard");
        } else {
          navigate("/register");
        }
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoading(false);
      }
    };

    checkApplications();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      {loading ? <p>Checking applications...</p> : <p>Redirecting...</p>}
    </div>
  );
};

export default ApplicationManager;
