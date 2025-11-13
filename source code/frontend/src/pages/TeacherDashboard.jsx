import { useState } from "react";
import { User, Power } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/userStore";

export default function TeacherDashboard() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const {user}=useUserStore();
  const handleLogout = () => {
    localStorage.removeItem("token");
    // localStorage.removeItem("user");
     window.location.href = "/signin";
  };

  const students = [
    { name: "Sai Varshith", roll: "22071A0592", company: "Google", status: "Pending" },
    { name: "Akhil", roll: "22071A0571", company: "Infosys", status: "Approved" },
  ];

  return (
    <div className="p-6 space-y-6">
      
      {/* Topbar */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Teacher Dashboard</h1>

        <div className="flex items-center gap-4">

          {/* Profile Icon */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition">
                <User size={26} />
              </button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">Profile Details</DialogTitle>
              </DialogHeader>

              <div className="space-y-3 text-sm">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                {/* <p><strong>Status:</strong> <Badge>Active</Badge></p> */}
              </div>
            </DialogContent>
          </Dialog>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-red-200 dark:hover:bg-red-900 transition"
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {students.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.roll}</TableCell>
                  <TableCell>{item.company}</TableCell>
                  <TableCell>
                    <Badge className={item.status === "Approved" ? "bg-green-600" : "bg-yellow-500"}>
                      {item.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm">View Docs</Button>
                      <Button size="sm" variant="outline">Approve</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
