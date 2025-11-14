import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Power, User, Download, Loader2 } from "lucide-react";
import { uploadToCloudinary } from "../../cloudinary";
import { useUserStore } from "@/store/userStore";

const StudentDashboard = () => {
  const [open, setOpen] = useState(false);
  const { user, token, checkAuth } = useUserStore();

  // File states
  const [offerLetter, setOfferLetter] = useState(null);
  const [noc, setNoc] = useState(null);
  const [certificate, setCertificate] = useState(null);

  const [uploading, setUploading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/signin";
  };

  // ============================
  // HANDLE UPLOAD
  // ============================
  const handleUpload = async () => {
    try {
      setUploading(true);

      const uploadData = {};

      const uploadFile = async (file, key) => {
        const url = await uploadToCloudinary(file);
        uploadData[key] = url;
      };

      if (offerLetter) await uploadFile(offerLetter, "offerLetter");
      if (noc) await uploadFile(noc, "noc");
      if (certificate) await uploadFile(certificate, "certificate");

      if (Object.keys(uploadData).length === 0) {
        alert("Please choose a file to upload.");
        setUploading(false);
        return;
      }

      const res = await fetch("http://localhost:5000/api/user/uploadDocs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ documents: uploadData }),
      });

      if (!res.ok) {
        alert("Upload failed!");
        setUploading(false);
        return;
      }

      alert("Documents uploaded successfully!");
      await checkAuth(); // refresh user info

    } catch (error) {
      console.log("Upload Error:", error);
      alert("Error uploading document");
    } finally {
      setUploading(false);
    }
  };

  // ============================
  // STATUS BADGE UI
  // ============================
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-600 text-white">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-600 text-white">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
    }
  };

  // Helper to show: STATUS + (comment)
  const renderStatusWithComment = (doc) => (
    <div className="flex items-center gap-2">
      {getStatusBadge(doc?.status)}

      {doc?.comment && (
        <span className="text-sm text-gray-600">
          ({doc.comment})
        </span>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-6">

      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Student Dashboard</h1>

        <div className="flex justify-between items-center gap-4">
          {/* Profile Dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="p-2 rounded-full hover:bg-gray-200 transition">
                <User size={26} />
              </button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">Profile Details</DialogTitle>
              </DialogHeader>

              <div className="space-y-3 text-sm">
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role}</p>
              </div>
            </DialogContent>
          </Dialog>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-red-200 transition"
          >
            <Power size={26} className="text-red-600" />
          </button>
        </div>
      </div>

      {/* Upload Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Internship Documents</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <label className="font-medium">Offer Letter</label>
            <Input type="file" onChange={(e) => setOfferLetter(e.target.files[0])} />
          </div>

          <div>
            <label className="font-medium">NOC</label>
            <Input type="file" onChange={(e) => setNoc(e.target.files[0])} />
          </div>

          <div>
            <label className="font-medium">Completion Certificate</label>
            <Input type="file" onChange={(e) => setCertificate(e.target.files[0])} />
          </div>

          <Button
            className="w-full flex items-center justify-center gap-2"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Uploading...
              </>
            ) : (
              "Upload Documents"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Document Status */}
      <Card>
        <CardHeader>
          <CardTitle>Document Status</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {[
            { label: "Offer Letter", key: "offerLetter" },
            { label: "NOC", key: "noc" },
            { label: "Completion Certificate", key: "certificate" },
          ].map((doc) => (
            <div key={doc.key}>
              <p className="font-medium mb-1">{doc.label}:</p>

              <div className="flex items-center gap-3">

                {/* Status + Comment */}
                {renderStatusWithComment(user?.documents?.[doc.key])}

                {/* Download Button */}
                {user?.documents?.[doc.key]?.url ? (
                  <a
                    href={user.documents[doc.key].url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Download size={16} /> Download
                    </Button>
                  </a>
                ) : (
                  <span className="text-sm text-gray-500">
                    No file uploaded
                  </span>
                )}

              </div>
            </div>
          ))}

        </CardContent>
      </Card>

    </div>
  );
};

export default StudentDashboard;
