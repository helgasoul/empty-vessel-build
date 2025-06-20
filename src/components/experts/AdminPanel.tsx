import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, UserPlus, AlertTriangle, Copy, CheckCircle } from "lucide-react";
import { useCreateUserRole, useDeleteUserRole, AppRole } from '@/hooks/useUserRoles';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import RoleManagementPanel from '@/components/rbac/RoleManagementPanel';

const AdminPanel = () => {
  return <RoleManagementPanel />;
};

export default AdminPanel;
