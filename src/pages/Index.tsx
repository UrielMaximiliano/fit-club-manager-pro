
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Gym Management System</h1>
            <p className="text-xl text-gray-600">Manage your gym members, routines and more.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader>
                <CardTitle>Member Management</CardTitle>
                <CardDescription>Register, update and track gym members</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Complete member profiles with personal information, membership details, and payment history.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="default" className="w-full">
                  <Link to="/members">
                    Go to Members <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader>
                <CardTitle>Student Routines</CardTitle>
                <CardDescription>View and manage weekly exercise routines</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Access and modify custom workout routines for each student organized by day of the week.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="default" className="w-full">
                  <Link to="/routines">
                    View Routines <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
