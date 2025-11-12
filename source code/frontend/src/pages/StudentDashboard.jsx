import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { Power, User } from "lucide-react"
import { useNavigate } from "react-router-dom"

const StudentDashboard = () => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token");      // delete JWT
    localStorage.removeItem("user");       // optional if you store user
     window.location.href = "/signin";                  // redirect to login
  };


  return (
    <div className="p-6 space-y-6">

      {/* Profile Info */}
      <div className="p-6 space-y-6 relative">

        {/* Topbar with Profile Icon */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Student Dashboard</h1>

          <div className="flex justify-between items-center gap-4">
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
                  <p><strong>Name:</strong> Sai Varshith</p>
                  <p><strong>Roll No:</strong> 22071A0592</p>
                  <p><strong>Branch:</strong> CSE</p>
                </div>
              </DialogContent>
            </Dialog>

            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-red-200 dark:hover:bg-red-900 transition"
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
              <Input type="file" />
            </div>
            <div>
              <label className="font-medium">NOC</label>
              <Input type="file" />
            </div>
            <div>
              <label className="font-medium">Completion Certificate</label>
              <Input type="file" />
            </div>

            <Button className="w-full">Upload Documents</Button>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Document Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Offer Letter: <Badge variant="secondary">Uploaded</Badge></p>
            <p>NOC: <Badge>Pending</Badge></p>
            <p>Certificate: <Badge>Pending</Badge></p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default StudentDashboard