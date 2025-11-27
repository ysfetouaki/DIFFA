'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@clerk/nextjs';
import { useTranslations } from '@/lib/i18n/hooks';
import { Plus, Edit, Trash2, Loader2, X, Users, Briefcase, Map, Search, RefreshCw, Eye, EyeOff, Upload, Link as LinkIcon } from 'lucide-react';
import Header from '@/components/sections/header';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle } from
'@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger } from
'@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
'@/components/ui/select';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

// Types
interface User {
  id: number;
  clerkId: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string;
  createdAt: string;
}

interface Service {
  id: number;
  title: {en: string;fr: string;es: string;it: string;};
  description: {en: string;fr: string;es: string;it: string;};
  icon: string;
  order: number;
  active: boolean;
}

interface ExcursionItem {
  id: string;
  label: string;
  price: number;
  defaultChecked: boolean;
}

type ExcursionSection = 'marrakech' | 'agadir' | 'taghazout' | 'circuits';

interface Excursion {
  _id: string;
  id: string;
  name: string;
  section: ExcursionSection;
  images: string[];
  priceMAD: number;
  location: string;
  duration: string;
  groupSize: string;
  rating: number;
  description: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  items?: ExcursionItem[];
}

interface ExcursionSetting {
  id: number;
  section: string;
  showPrice: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const t = useTranslations('admin');

  const [activeTab, setActiveTab] = useState('users');
  const [activeExcursionSection, setActiveExcursionSection] = useState<ExcursionSection>('marrakech');
  const [loading, setLoading] = useState(true);

  // Check if user is admin from Clerk's publicMetadata
  const isAdmin = clerkUser?.publicMetadata?.role === 'admin';

  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [userFormData, setUserFormData] = useState({ name: '', email: '', phone: '', role: 'user' });
  const [syncing, setSyncing] = useState(false);

  // Services state
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [serviceFormData, setServiceFormData] = useState({
    titleEn: '', titleFr: '', titleEs: '', titleIt: '',
    descriptionEn: '', descriptionFr: '', descriptionEs: '', descriptionIt: '',
    icon: '', order: 0, active: true
  });

  // Excursions state
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [editingExcursion, setEditingExcursion] = useState<Excursion | null>(null);
  const [excursionDialogOpen, setExcursionDialogOpen] = useState(false);
  const [excursionFormData, setExcursionFormData] = useState({
    id: '', name: '', section: 'marrakech' as ExcursionSection, images: '', priceMAD: '', location: '', duration: '',
    groupSize: '', rating: '0', description: '', highlights: '',
    included: '', notIncluded: ''
  });
  const [items, setItems] = useState<ExcursionItem[]>([]);

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<'url' | 'upload'>('url');

  // Excursion settings state
  const [excursionSettings, setExcursionSettings] = useState<ExcursionSetting[]>([]);
  const [updatingSettings, setUpdatingSettings] = useState(false);

  const [saving, setSaving] = useState(false);

  // Check admin access
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !clerkUser) {
      router.push('/sign-in');
      return;
    }

    // Check admin role from Clerk's publicMetadata
    if (clerkUser.publicMetadata?.role !== 'admin') {
      toast.error('Access denied. Admin role required.');
      router.push('/');
      return;
    }

    setLoading(false);
  }, [isLoaded, isSignedIn, clerkUser, router]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const token = await getToken();
      const params = new URLSearchParams();
      if (userSearch) params.append('search', userSearch);
      if (userRoleFilter !== 'all') params.append('role', userRoleFilter);

      const response = await fetch(`/api/admin/users?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.users) {
        setUsers(data.users);
      } else {
        console.error('No users in response:', data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error(t('error'));
    }
  };

  // Fetch services
  const fetchServices = async () => {
    try {
      const token = await getToken();
      const response = await fetch('/api/admin/services', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setServices(data);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
      toast.error(t('error'));
    }
  };

  // Fetch excursions
  const fetchExcursions = async () => {
    try {
      const token = await getToken();
      const response = await fetch('/api/admin/excursions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setExcursions(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch excursions:', error);
      toast.error(t('error'));
    }
  };

  // Fetch excursion settings
  const fetchExcursionSettings = async () => {
    try {
      const token = await getToken();
      const response = await fetch('/api/admin/excursion-settings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setExcursionSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch excursion settings:', error);
      toast.error('Failed to load excursion settings');
    }
  };

  // Update excursion setting
  const handleTogglePriceVisibility = async (section: string, currentValue: boolean) => {
    setUpdatingSettings(true);
    try {
      const token = await getToken();
      const response = await fetch(`/api/admin/excursion-settings/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ showPrice: !currentValue })
      });

      if (response.ok) {
        toast.success(`Price visibility updated for ${section}`);
        fetchExcursionSettings();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update setting');
      }
    } catch (error) {
      console.error('Update setting error:', error);
      toast.error('Failed to update setting');
    } finally {
      setUpdatingSettings(false);
    }
  };

  useEffect(() => {
    if (isAdmin && activeTab === 'users') fetchUsers();
  }, [isAdmin, activeTab, userSearch, userRoleFilter]);

  useEffect(() => {
    if (isAdmin && activeTab === 'services') fetchServices();
  }, [isAdmin, activeTab]);

  useEffect(() => {
    if (isAdmin && activeTab === 'excursions') {
      fetchExcursions();
      fetchExcursionSettings();
    }
  }, [isAdmin, activeTab]);

  // User handlers
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name || '',
      email: user.email,
      phone: user.phone || '',
      role: user.role
    });
    setUserDialogOpen(true);
  };

  const handleSyncUsers = async () => {
    setSyncing(true);
    try {
      const token = await getToken();
      const response = await fetch('/api/admin/sync-users', { 
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success(data.message || 'Users synced successfully!');
        fetchUsers();
      } else {
        toast.error(data.error || 'Failed to sync users');
      }
    } catch (error) {
      console.error('Sync users error:', error);
      toast.error('Failed to sync users');
    } finally {
      setSyncing(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm(t('users.deleteConfirm'))) return;

    try {
      const token = await getToken();
      const response = await fetch(`/api/admin/users/${id}`, { 
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        toast.success(t('users.deleteSuccess'));
        fetchUsers();
      } else {
        toast.error(t('error'));
      }
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error(t('error'));
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setSaving(true);
    try {
      const token = await getToken();
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userFormData)
      });

      if (response.ok) {
        toast.success(t('users.updateSuccess'));
        setUserDialogOpen(false);
        fetchUsers();
      } else {
        toast.error(t('error'));
      }
    } catch (error) {
      console.error('Save user error:', error);
      toast.error(t('error'));
    } finally {
      setSaving(false);
    }
  };

  // Service handlers
  const handleCreateService = () => {
    setEditingService(null);
    setServiceFormData({
      titleEn: '', titleFr: '', titleEs: '', titleIt: '',
      descriptionEn: '', descriptionFr: '', descriptionEs: '', descriptionIt: '',
      icon: '', order: services.length, active: true
    });
    setServiceDialogOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceFormData({
      titleEn: service.title.en,
      titleFr: service.title.fr,
      titleEs: service.title.es,
      titleIt: service.title.it,
      descriptionEn: service.description.en,
      descriptionFr: service.description.fr,
      descriptionEs: service.description.es,
      descriptionIt: service.description.it,
      icon: service.icon,
      order: service.order,
      active: service.active
    });
    setServiceDialogOpen(true);
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm(t('services.deleteConfirm'))) return;

    try {
      const token = await getToken();
      const response = await fetch(`/api/admin/services/${id}`, { 
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        toast.success(t('services.deleteSuccess'));
        fetchServices();
      } else {
        toast.error(t('error'));
      }
    } catch (error) {
      console.error('Delete service error:', error);
      toast.error(t('error'));
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = await getToken();
      const payload = {
        title: {
          en: serviceFormData.titleEn,
          fr: serviceFormData.titleFr,
          es: serviceFormData.titleEs,
          it: serviceFormData.titleIt
        },
        description: {
          en: serviceFormData.descriptionEn,
          fr: serviceFormData.descriptionFr,
          es: serviceFormData.descriptionEs,
          it: serviceFormData.descriptionIt
        },
        icon: serviceFormData.icon,
        order: serviceFormData.order,
        active: serviceFormData.active
      };

      const url = editingService ? `/api/admin/services/${editingService.id}` : '/api/admin/services';
      const method = editingService ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(editingService ? t('services.updateSuccess') : t('services.createSuccess'));
        setServiceDialogOpen(false);
        fetchServices();
      } else {
        toast.error(t('error'));
      }
    } catch (error) {
      console.error('Save service error:', error);
      toast.error(t('error'));
    } finally {
      setSaving(false);
    }
  };

  // Excursion handlers
  const handleCreateExcursion = (section: ExcursionSection) => {
    setEditingExcursion(null);
    setExcursionFormData({
      id: '', name: '', section: section, images: '', priceMAD: '', location: '', duration: '',
      groupSize: '', rating: '0', description: '', highlights: '',
      included: '', notIncluded: ''
    });
    setItems([{ id: 'standard', label: 'Standard Tour', price: 0, defaultChecked: true }]);
    setExcursionDialogOpen(true);
  };

  const handleEditExcursion = (excursion: Excursion) => {
    setEditingExcursion(excursion);
    setExcursionFormData({
      id: excursion.id,
      name: excursion.name,
      section: excursion.section,
      images: excursion.images.join(', '),
      priceMAD: excursion.priceMAD.toString(),
      location: excursion.location,
      duration: excursion.duration,
      groupSize: excursion.groupSize,
      rating: excursion.rating.toString(),
      description: excursion.description,
      highlights: excursion.highlights.join(', '),
      included: excursion.included.join(', '),
      notIncluded: excursion.notIncluded.join(', ')
    });
    setItems(excursion.items || [{ id: 'standard', label: 'Standard Tour', price: excursion.priceMAD, defaultChecked: true }]);
    setExcursionDialogOpen(true);
  };

  const handleDeleteExcursion = async (id: string) => {
    if (!confirm(t('excursions.deleteConfirm'))) return;

    try {
      const token = await getToken();
      const response = await fetch(`/api/admin/excursions/${id}`, { 
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        toast.success(t('excursions.deleteSuccess'));
        fetchExcursions();
      } else {
        toast.error(t('error'));
      }
    } catch (error) {
      console.error('Delete excursion error:', error);
      toast.error(t('error'));
    }
  };

  const handleSaveExcursion = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = await getToken();
      const payload = {
        id: excursionFormData.id,
        name: excursionFormData.name,
        section: excursionFormData.section,
        images: excursionFormData.images.split(',').map((img) => img.trim()).filter(img => img),
        priceMAD: parseFloat(excursionFormData.priceMAD),
        location: excursionFormData.location,
        duration: excursionFormData.duration,
        groupSize: excursionFormData.groupSize,
        rating: parseFloat(excursionFormData.rating),
        description: excursionFormData.description,
        highlights: excursionFormData.highlights.split(',').map((h) => h.trim()),
        included: excursionFormData.included.split(',').map((i) => i.trim()),
        notIncluded: excursionFormData.notIncluded.split(',').map((n) => n.trim()),
        items: items,
        ageGroups: true
      };

      const url = editingExcursion ? `/api/admin/excursions/${editingExcursion._id}` : '/api/admin/excursions';
      const method = editingExcursion ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(editingExcursion ? t('excursions.updateSuccess') : t('excursions.createSuccess'));
        setExcursionDialogOpen(false);
        fetchExcursions();
      } else {
        const data = await response.json();
        toast.error(data.error || t('error'));
      }
    } catch (error) {
      console.error('Save excursion error:', error);
      toast.error(t('error'));
    } finally {
      setSaving(false);
    }
  };

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const token = await getToken();
        const response = await fetch('/api/admin/upload-image', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.url);
        } else {
          const error = await response.json();
          toast.error(error.error || `Failed to upload ${file.name}`);
        }
      }

      if (uploadedUrls.length > 0) {
        // Add uploaded URLs to existing images
        const existingImages = excursionFormData.images
          ? excursionFormData.images.split(',').map(img => img.trim()).filter(img => img)
          : [];
        const allImages = [...existingImages, ...uploadedUrls];
        setExcursionFormData({
          ...excursionFormData,
          images: allImages.join(', ')
        });
        toast.success(`Successfully uploaded ${uploadedUrls.length} image(s)`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploadingImage(false);
      // Reset file input
      e.target.value = '';
    }
  };

  // Remove individual image from list
  const handleRemoveImage = (imageUrl: string) => {
    const images = excursionFormData.images
      .split(',')
      .map(img => img.trim())
      .filter(img => img && img !== imageUrl);
    setExcursionFormData({
      ...excursionFormData,
      images: images.join(', ')
    });
  };

  // Excursion item handlers
  const handleAddItem = () => {
    setItems([...items, { id: `item-${Date.now()}`, label: '', price: 0, defaultChecked: false }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof ExcursionItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  // Filter excursions by active section
  const filteredExcursions = excursions.filter((exc) => exc.section === activeExcursionSection);

  // Get setting for current section
  const getCurrentSectionSetting = (section: ExcursionSection) => {
    return excursionSettings.find((s) => s.section === section);
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-32">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-8 px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold">{t('title')}</h1>
            <p className="text-muted mt-2">{t('subtitle')}</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {t('tabs.users')}
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {t('tabs.services')}
              </TabsTrigger>
              <TabsTrigger value="excursions" className="flex items-center gap-2">
                <Map className="w-4 h-4" />
                {t('tabs.excursions')}
              </TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-semibold">{t('users.title')}</h2>
                  <Button 
                    onClick={handleSyncUsers} 
                    disabled={syncing}
                    variant="outline"
                    className="gap-2"
                  >
                    {syncing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Sync Clerk Users
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <Input
                      placeholder={t('users.searchPlaceholder')}
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-10" />

                  </div>
                  <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('users.filter.all')}</SelectItem>
                      <SelectItem value="admin">{t('users.filter.admin')}</SelectItem>
                      <SelectItem value="user">{t('users.filter.user')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('users.table.name')}</TableHead>
                      <TableHead>{t('users.table.email')}</TableHead>
                      <TableHead>{t('users.table.phone')}</TableHead>
                      <TableHead>{t('users.table.role')}</TableHead>
                      <TableHead>{t('users.table.createdAt')}</TableHead>
                      <TableHead className="text-right">{t('users.table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ?
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted">
                          {t('users.noUsers')}
                        </TableCell>
                      </TableRow> :

                    users.map((user) =>
                    <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name || '-'}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone || '-'}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-700'}`
                        }>
                              {user.role === 'admin' ? t('users.role.admin') : t('users.role.user')}
                            </span>
                          </TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={user.clerkId === clerkUser?.id}>

                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                    )
                    }
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-semibold">{t('services.title')}</h2>
                  <Button onClick={handleCreateService} className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    {t('services.addService')}
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('services.table.title')}</TableHead>
                      <TableHead>{t('services.table.icon')}</TableHead>
                      <TableHead>{t('services.table.order')}</TableHead>
                      <TableHead>{t('services.table.active')}</TableHead>
                      <TableHead className="text-right">{t('services.table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.length === 0 ?
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted">
                          {t('services.noServices')}
                        </TableCell>
                      </TableRow> :

                    services.map((service) =>
                    <TableRow key={service.id}>
                          <TableCell className="font-medium">{service.title.en}</TableCell>
                          <TableCell>{service.icon}</TableCell>
                          <TableCell>{service.order}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        service.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`
                            }>
                              {service.active ? t('services.status.active') : t('services.status.inactive')}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditService(service)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteService(service.id)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                    )
                    }
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Excursions Tab */}
            <TabsContent value="excursions">
              <div className="space-y-6">
                {/* Price Visibility Controls */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Price Visibility Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(['marrakech', 'agadir', 'taghazout', 'circuits'] as ExcursionSection[]).map((section) => {
                      const setting = getCurrentSectionSetting(section);
                      const isVisible = setting?.showPrice ?? true;
                      
                      return (
                        <div key={section} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            {isVisible ? (
                              <Eye className="w-5 h-5 text-primary" />
                            ) : (
                              <EyeOff className="w-5 h-5 text-muted" />
                            )}
                            <div>
                              <p className="font-medium capitalize">{section}</p>
                              <p className="text-xs text-muted">
                                {isVisible ? 'Prices visible' : 'Prices hidden'}
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={isVisible}
                            onCheckedChange={() => handleTogglePriceVisibility(section, isVisible)}
                            disabled={updatingSettings}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Excursion Sections */}
                <div className="bg-white rounded-lg shadow">
                  <Tabs value={activeExcursionSection} onValueChange={(val) => setActiveExcursionSection(val as ExcursionSection)}>
                    <div className="border-b border-border px-6 pt-6">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="marrakech">Marrakech</TabsTrigger>
                        <TabsTrigger value="agadir">Agadir</TabsTrigger>
                        <TabsTrigger value="taghazout">Taghazout</TabsTrigger>
                        <TabsTrigger value="circuits">Circuits</TabsTrigger>
                      </TabsList>
                    </div>

                    {(['marrakech', 'agadir', 'taghazout', 'circuits'] as ExcursionSection[]).map((section) => (
                      <TabsContent key={section} value={section} className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-semibold capitalize">{section} Excursions</h3>
                          <Button onClick={() => handleCreateExcursion(section)} className="bg-primary hover:bg-primary/90">
                            <Plus className="w-4 h-4 mr-2" />
                            Add {section} Excursion
                          </Button>
                        </div>

                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Duration</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredExcursions.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted">
                                  No excursions found for {section}
                                </TableCell>
                              </TableRow>
                            ) : (
                              filteredExcursions.map((excursion) => (
                                <TableRow key={excursion._id}>
                                  <TableCell className="font-mono text-sm">{excursion.id}</TableCell>
                                  <TableCell className="font-medium">{excursion.name}</TableCell>
                                  <TableCell>{excursion.location}</TableCell>
                                  <TableCell>{excursion.priceMAD} MAD</TableCell>
                                  <TableCell>{excursion.duration}</TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <Button variant="outline" size="sm" onClick={() => handleEditExcursion(excursion)}>
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button variant="outline" size="sm" onClick={() => handleDeleteExcursion(excursion._id)}>
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* User Edit Dialog */}
          <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('dialog.editUser')}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSaveUser} className="space-y-4">
                <div>
                  <Label htmlFor="name">{t('form.name')}</Label>
                  <Input
                    id="name"
                    value={userFormData.name}
                    onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })} />

                </div>
                <div>
                  <Label htmlFor="email">{t('form.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    required />

                </div>
                <div>
                  <Label htmlFor="phone">{t('form.phone')}</Label>
                  <Input
                    id="phone"
                    value={userFormData.phone}
                    onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })} />

                </div>
                <div>
                  <Label htmlFor="role">{t('form.role')}</Label>
                  <Select value={userFormData.role} onValueChange={(value) => setUserFormData({ ...userFormData, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">{t('users.role.user')}</SelectItem>
                      <SelectItem value="admin">{t('users.role.admin')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setUserDialogOpen(false)} disabled={saving}>
                    {t('dialog.cancel')}
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('dialog.saving')}</> : t('dialog.save')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Service Dialog */}
          <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingService ? t('dialog.editService') : t('dialog.createService')}</DialogTitle>
                <DialogDescription>
                  {t('form.required')}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveService} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('form.titleEn')}</Label>
                    <Input value={serviceFormData.titleEn} onChange={(e) => setServiceFormData({ ...serviceFormData, titleEn: e.target.value })} required />
                  </div>
                  <div>
                    <Label>{t('form.titleFr')}</Label>
                    <Input value={serviceFormData.titleFr} onChange={(e) => setServiceFormData({ ...serviceFormData, titleFr: e.target.value })} required />
                  </div>
                  <div>
                    <Label>{t('form.titleEs')}</Label>
                    <Input value={serviceFormData.titleEs} onChange={(e) => setServiceFormData({ ...serviceFormData, titleEs: e.target.value })} required />
                  </div>
                  <div>
                    <Label>{t('form.titleIt')}</Label>
                    <Input value={serviceFormData.titleIt} onChange={(e) => setServiceFormData({ ...serviceFormData, titleIt: e.target.value })} required />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('form.descriptionEn')}</Label>
                    <Textarea value={serviceFormData.descriptionEn} onChange={(e) => setServiceFormData({ ...serviceFormData, descriptionEn: e.target.value })} required rows={3} />
                  </div>
                  <div>
                    <Label>{t('form.descriptionFr')}</Label>
                    <Textarea value={serviceFormData.descriptionFr} onChange={(e) => setServiceFormData({ ...serviceFormData, descriptionFr: e.target.value })} required rows={3} />
                  </div>
                  <div>
                    <Label>{t('form.descriptionEs')}</Label>
                    <Textarea value={serviceFormData.descriptionEs} onChange={(e) => setServiceFormData({ ...serviceFormData, descriptionEs: e.target.value })} required rows={3} />
                  </div>
                  <div>
                    <Label>{t('form.descriptionIt')}</Label>
                    <Textarea value={serviceFormData.descriptionIt} onChange={(e) => setServiceFormData({ ...serviceFormData, descriptionIt: e.target.value })} required rows={3} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>{t('form.icon')}</Label>
                    <Input value={serviceFormData.icon} onChange={(e) => setServiceFormData({ ...serviceFormData, icon: e.target.value })} required placeholder="Car" />
                  </div>
                  <div>
                    <Label>{t('form.order')}</Label>
                    <Input type="number" value={serviceFormData.order} onChange={(e) => setServiceFormData({ ...serviceFormData, order: parseInt(e.target.value) })} required />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={serviceFormData.active}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, active: e.target.checked })}
                        className="w-4 h-4" />

                      <span>{t('form.active')}</span>
                    </label>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setServiceDialogOpen(false)} disabled={saving}>
                    {t('dialog.cancel')}
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ?
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{editingService ? t('dialog.saving') : t('dialog.creating')}</> :

                    editingService ? t('dialog.save') : t('dialog.create')
                    }
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Excursion Dialog */}
          <Dialog open={excursionDialogOpen} onOpenChange={setExcursionDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingExcursion ? t('dialog.editExcursion') : t('dialog.createExcursion')}</DialogTitle>
                <DialogDescription>
                  Fill in the details for the excursion. Use commas to separate multiple items.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveExcursion} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="id">Excursion ID *</Label>
                    <Input
                      id="id"
                      value={excursionFormData.id}
                      onChange={(e) => setExcursionFormData({ ...excursionFormData, id: e.target.value })}
                      placeholder="e.g., essaouira-taghazout"
                      required
                      disabled={!!editingExcursion} />
                  </div>
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={excursionFormData.name}
                      onChange={(e) => setExcursionFormData({ ...excursionFormData, name: e.target.value })}
                      required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="section">{t('form.section')} *</Label>
                  <Select
                    value={excursionFormData.section}
                    onValueChange={(value: ExcursionSection) => setExcursionFormData({ ...excursionFormData, section: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marrakech">{t('excursions.sections.marrakech')}</SelectItem>
                      <SelectItem value="agadir">{t('excursions.sections.agadir')}</SelectItem>
                      <SelectItem value="taghazout">{t('excursions.sections.taghazout')}</SelectItem>
                      <SelectItem value="circuits">{t('excursions.sections.circuits')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Images *</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={imageInputMode === 'url' ? 'default' : 'outline'}
                        onClick={() => setImageInputMode('url')}
                        className="h-8 text-xs"
                      >
                        <LinkIcon className="w-3 h-3 mr-1" />
                        URL
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={imageInputMode === 'upload' ? 'default' : 'outline'}
                        onClick={() => setImageInputMode('upload')}
                        className="h-8 text-xs"
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        Upload
                      </Button>
                    </div>
                  </div>

                  {imageInputMode === 'url' ? (
                    <Input
                      id="images"
                      value={excursionFormData.images}
                      onChange={(e) => setExcursionFormData({ ...excursionFormData, images: e.target.value })}
                      placeholder="Enter image URLs separated by commas"
                      required={!excursionFormData.images}
                    />
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                          multiple
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="flex-1"
                        />
                        {uploadingImage && (
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted">
                        Max 5MB per image. Formats: JPEG, PNG, WebP, GIF
                      </p>
                    </div>
                  )}

                  {/* Display uploaded/added images */}
                  {excursionFormData.images && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-medium text-muted">Added Images:</p>
                      <div className="flex flex-wrap gap-2">
                        {excursionFormData.images.split(',').map((img, idx) => {
                          const trimmedImg = img.trim();
                          if (!trimmedImg) return null;
                          return (
                            <div
                              key={idx}
                              className="relative group bg-secondary/30 rounded px-2 py-1 pr-7 text-xs flex items-center gap-2 max-w-xs"
                            >
                              <span className="truncate">{trimmedImg}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(trimmedImg)}
                                className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3 text-destructive" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="priceMAD">Price (MAD) *</Label>
                    <Input
                      id="priceMAD"
                      type="number"
                      value={excursionFormData.priceMAD}
                      onChange={(e) => setExcursionFormData({ ...excursionFormData, priceMAD: e.target.value })}
                      required />
                  </div>
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={excursionFormData.location}
                      onChange={(e) => setExcursionFormData({ ...excursionFormData, location: e.target.value })}
                      required />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration *</Label>
                    <Input
                      id="duration"
                      value={excursionFormData.duration}
                      onChange={(e) => setExcursionFormData({ ...excursionFormData, duration: e.target.value })}
                      required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="groupSize">Group Size *</Label>
                    <Input
                      id="groupSize"
                      value={excursionFormData.groupSize}
                      onChange={(e) => setExcursionFormData({ ...excursionFormData, groupSize: e.target.value })}
                      required />
                  </div>
                  <div>
                    <Label htmlFor="rating">Rating (0-5)</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={excursionFormData.rating}
                      onChange={(e) => setExcursionFormData({ ...excursionFormData, rating: e.target.value })} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={excursionFormData.description}
                    onChange={(e) => setExcursionFormData({ ...excursionFormData, description: e.target.value })}
                    rows={3}
                    required />
                </div>

                <div>
                  <Label htmlFor="highlights">Highlights (comma-separated) *</Label>
                  <Textarea
                    id="highlights"
                    value={excursionFormData.highlights}
                    onChange={(e) => setExcursionFormData({ ...excursionFormData, highlights: e.target.value })}
                    rows={2}
                    required />
                </div>

                <div>
                  <Label htmlFor="included">What's Included (comma-separated) *</Label>
                  <Textarea
                    id="included"
                    value={excursionFormData.included}
                    onChange={(e) => setExcursionFormData({ ...excursionFormData, included: e.target.value })}
                    rows={2}
                    required />
                </div>

                <div>
                  <Label htmlFor="notIncluded">Not Included (comma-separated) *</Label>
                  <Textarea
                    id="notIncluded"
                    value={excursionFormData.notIncluded}
                    onChange={(e) => setExcursionFormData({ ...excursionFormData, notIncluded: e.target.value })}
                    rows={2}
                    required />
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-semibold">Booking Items/Options *</Label>
                    <Button type="button" onClick={handleAddItem} size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Item
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {items.map((item, index) =>
                    <div key={index} className="flex gap-2 items-start p-3 bg-secondary/30 rounded-lg">
                        <div className="flex-1 grid grid-cols-12 gap-2">
                          <div className="col-span-3">
                            <Input
                              placeholder="Item ID"
                              value={item.id}
                              onChange={(e) => handleItemChange(index, 'id', e.target.value)}
                              required />
                          </div>
                          <div className="col-span-5">
                            <Input
                              placeholder="Item Label"
                              value={item.label}
                              onChange={(e) => handleItemChange(index, 'label', e.target.value)}
                              required />
                          </div>
                          <div className="col-span-3">
                            <Input
                              type="number"
                              placeholder="Price (MAD)"
                              value={item.price}
                              onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                              required />
                          </div>
                          <div className="col-span-1 flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={item.defaultChecked}
                              onChange={(e) => handleItemChange(index, 'defaultChecked', e.target.checked)}
                              className="w-4 h-4"
                              title="Default checked" />
                          </div>
                        </div>
                        {items.length > 1 &&
                          <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveItem(index)} className="text-destructive">
                            <X className="w-4 h-4" />
                          </Button>
                        }
                    </div>
                    )}
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setExcursionDialogOpen(false)} disabled={saving}>
                    {t('dialog.cancel')}
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ?
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('dialog.saving')}</> :
                    editingExcursion ? t('dialog.save') : t('dialog.create')
                    }
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}