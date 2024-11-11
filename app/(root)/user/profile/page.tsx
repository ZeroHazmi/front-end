'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, Pencil } from 'lucide-react'
import { getCookie } from '@/app/lib/auth'

interface UserData {
  userName: string;
  birthday: string;
  gender: string;
  nationality: string;
  descendants: string;
  religion: string;
  phoneNumber: string;
  housePhoneNumber: string;
  officePhoneNumber: string;
  address: string;
  postcode: string;
  state: string;
  region: string;
  email: string;
  icNumber: string;
}

export default function UserProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    userName: "",
    birthday: "",
    gender: "",
    nationality: "",
    descendants: "",
    religion: "",
    phoneNumber: "",
    housePhoneNumber: "",
    officePhoneNumber: "",
    address: "",
    postcode: "",
    state: "",
    region: "",
    email: "",
    icNumber: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setUserData(prevData => ({ ...prevData, [name]: value }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await getCookie("userId");
        console.log("User ID from cookies:", userId);
  
        if (userId) {
          const response = await fetch(`http://localhost:5035/api/user/${userId}`);
          if (response.ok) {
            const data = await response.json();
            console.log("User data:", data);
            
            setUserData({
              userName: data.username || "",
              birthday: data.birthday || "",
              gender: data.gender === 1 ? "Male" : "Female",
              nationality: data.nationality || "",
              descendants: data.descendants || "",
              religion: data.religion || "",
              phoneNumber: data.phoneNumber || "",
              housePhoneNumber: data.house_Phone_Number || "",
              officePhoneNumber: data.office_Phone_Number || "",
              address: data.address || "",
              postcode: data.postcode || "",
              state: data.state || "",
              region: data.region || "",
              email: data.email || "",
              icNumber: data.icNumber || ""
            });
          } else {
            console.error("Failed to fetch user data");
          }
        } else {
          console.error("User ID is missing in cookies");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUserData();
  }, []);

  useEffect(() => {
    if(isEditing) {
      console.log("User data in edit mode:", userData);
    }
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 mt-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-3xl font-bold">User Profile</CardTitle>
          <Button onClick={toggleEdit} variant="outline">
            <Pencil className="mr-2 h-4 w-4" />
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
                <AvatarFallback>{userData.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userName">Username</Label>
                  <Input
                    id="userName"
                    name="userName"
                    value={userData.userName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthday">Birthday</Label>
                  <div className="relative">
                    <Input
                      id="birthday"
                      name="birthday"
                      type="date"
                      value={userData.birthday}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    disabled={true}
                    onValueChange={(value) => handleSelectChange('gender', value)}
                    value={userData.gender}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    name="nationality"
                    value={userData.nationality}
                    onChange={handleInputChange}
                    disabled={true}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="descendants">Descendants</Label>
                  <Input
                    id="descendants"
                    name="descendants"
                    value={userData.descendants}
                    onChange={handleInputChange}
                    disabled={true}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="religion">Religion</Label>
                  <Input
                    id="religion"
                    name="religion"
                    value={userData.religion}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icNumber">IC Number</Label>
                  <Input
                    id="icNumber"
                    name="icNumber"
                    value={userData.icNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={userData.phoneNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="housePhoneNumber">House Phone</Label>
                  <Input
                    id="housePhoneNumber"
                    name="housePhoneNumber"
                    value={userData.housePhoneNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="officePhoneNumber">Office Phone</Label>
                  <Input
                    id="officePhoneNumber"
                    name="officePhoneNumber"
                    value={userData.officePhoneNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={userData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input
                    id="postcode"
                    name="postcode"
                    value={userData.postcode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={userData.state}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    name="region"
                    value={userData.region}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}