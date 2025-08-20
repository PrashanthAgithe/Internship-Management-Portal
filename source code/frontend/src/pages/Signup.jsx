import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const Signup = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
          <CardDescription className={"text-center"}>
            Enter your information to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4"> {/* Changed parent gap for better spacing */}
          {/* Name Input (Corrected for full width) */}
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="John Doe" required />
          </div>

          {/* Role Selection (Student or Teacher) */}
          <div className="grid gap-2">
            <Label>Are you a...</Label>
            <RadioGroup defaultValue="student" className="flex items-center pt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="role-student" />
                <Label htmlFor="role-student">Student</Label>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <RadioGroupItem value="teacher" id="role-teacher" />
                <Label htmlFor="role-teacher">Teacher</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Email Input */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password Input */}
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="***********" required />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Create an account
          </Button>
        </CardContent>
        <CardFooter>
          {/* Navigation to Signin Page */}
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/signin" className="underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};