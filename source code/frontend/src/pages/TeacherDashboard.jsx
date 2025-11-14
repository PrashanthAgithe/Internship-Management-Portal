import { useEffect, useState } from "react";
import { User, Power, Download, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useUserStore } from "@/store/userStore";

export default function TeacherDashboard() {
  const [openProfile, setOpenProfile] = useState(false);
  const [openDocsDialog, setOpenDocsDialog] = useState(false);
  const [openCommentDialog, setOpenCommentDialog] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [comment, setComment] = useState("");

  // Loader per-document when approval/rejection is happening
  const [updatingDoc, setUpdatingDoc] = useState(null);

  const {
    user,
    students,
    fetchStudents,
    updateDocumentStatus,
    studentsLoading,
  } = useUserStore();

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/signin";
  };

  const openDocs = (student) => {
    setSelectedStudent(student);
    setOpenDocsDialog(true);
  };

  const openApprovalDialog = (docType) => {
    setSelectedDocType(docType);
    setComment("");
    setOpenCommentDialog(true);
  };

  // Submit approve/reject action
  const submitApproval = async (status) => {
    setUpdatingDoc(selectedDocType);

    await updateDocumentStatus(
      selectedStudent._id,
      selectedDocType,
      status,
      comment
    );

    await fetchStudents();

    const updatedStudent = useUserStore.getState().students.find(
      (s) => s._id === selectedStudent._id
    );

    setSelectedStudent(updatedStudent);

    setUpdatingDoc(null);
    setOpenCommentDialog(false);
  };

  const docLabels = {
    offerLetter: "Offer Letter",
    noc: "NOC",
    certificate: "Completion Certificate",
  };

  // ⭐ Combine Status Badge + Comment into a single UI
  const renderStatusWithComment = (doc) => {
    if (!doc) return null;

    return (
      <div className="flex items-center gap-2">
        <Badge
          className={
            doc.status === "approved"
              ? "bg-green-600"
              : doc.status === "rejected"
                ? "bg-red-600"
                : "bg-yellow-500"
          }
        >
          {doc.status}
        </Badge>

        {doc.comment && (
          <span className="text-sm text-gray-600">({doc.comment})</span>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">

      {/* Topbar */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Professor Dashboard</h1>

        <div className="flex items-center gap-4">

          {/* Profile Dialog */}
          <Dialog open={openProfile} onOpenChange={setOpenProfile}>
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

      {/* Student Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Internship Submissions</CardTitle>
        </CardHeader>

        <CardContent>
          {studentsLoading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {students?.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>

                    <TableCell>
                      <Button size="sm" onClick={() => openDocs(student)}>
                        View Docs
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          )}
        </CardContent>
      </Card>

      {/* VIEW DOCS DIALOG */}
      <Dialog open={openDocsDialog} onOpenChange={setOpenDocsDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Student Documents</DialogTitle>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-6">

              {Object.keys(docLabels).map((key) => {
                const doc = selectedStudent.documents?.[key];
                const status = doc?.status;

                return (
                  <Card key={key} className="p-4">
                    <p className="font-medium mb-2">{docLabels[key]}</p>

                    {/* Download & Actions */}
                    <div className="flex items-center gap-3">

                      {/* Download */}
                      {doc?.url ? (
                        <a href={doc.url} target="_blank" rel="noreferrer">
                          <Button size="sm" variant="secondary" className="flex items-center gap-2">
                            <Download size={16} /> Download
                          </Button>
                        </a>
                      ) : (
                        <span className="text-sm text-gray-500">Not uploaded</span>
                      )}

                      {/* Approve */}
                      <Button
                        size="sm"
                        disabled={!doc?.url || status === "approved" || updatingDoc === key}
                        onClick={() => openApprovalDialog(key)}
                        className={status === "approved" ? "opacity-50 cursor-not-allowed" : ""}
                      >
                        {updatingDoc === key ? <Loader2 size={16} className="animate-spin" /> : "Approve"}
                      </Button>

                      {/* Reject */}
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={!doc?.url || status === "rejected" || updatingDoc === key}
                        onClick={() => openApprovalDialog(key)}
                        className={status === "rejected" ? "opacity-50 cursor-not-allowed" : ""}
                      >
                        {updatingDoc === key ? <Loader2 size={16} className="animate-spin" /> : "Reject"}
                      </Button>
                    </div>

                    {/* ⭐ Status With Comment */}
                    <div className="mt-3">
                      {renderStatusWithComment(doc)}
                    </div>

                  </Card>
                );
              })}

            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* COMMENT DIALOG */}
      <Dialog open={openCommentDialog} onOpenChange={setOpenCommentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
          </DialogHeader>

          <Textarea
            placeholder="Enter comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-2"
          />

          <div className="flex justify-end gap-3 mt-4">

            <Button variant="outline" onClick={() => setOpenCommentDialog(false)}>
              Cancel
            </Button>

            <Button
              onClick={() => submitApproval("approved")}
              className="bg-green-600 text-white"
            >
              Approve
            </Button>

            <Button
              variant="destructive"
              onClick={() => submitApproval("rejected")}
            >
              Reject
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
